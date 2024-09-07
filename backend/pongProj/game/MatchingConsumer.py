import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.db.models import Q
from .models import User, singleMatch
import time

class MatchmakingConsumer(AsyncWebsocketConsumer):
    waiting_players = []
    channel_name_map = {}
    room_name = ""

    async def connect(self):
        self.user = self.scope["user"]
        print(self.user)
        if self.user.is_authenticated:
            if await self.is_player_in_active_game(self.user.username):
                print("player already in game!")
            else:
                self.add_to_waiting_list()
                await self.match_players()
                await self.accept()

                await self.send(text_data=json.dumps({
                        'status': 'player_joined',
                        'username': self.user.username,
                        }))
            
        else:
            print("Unauthenticated user.")
            await self.close()

    async def disconnect(self, close_code):
        print("Disconnected.")
        self.remove_from_waiting_list()
        print(f"Remaining players in waiting list: {len(self.__class__.waiting_players)}")
        room_name = await self.mark_room_inactive()
        if room_name:
            await self.notify_opponent(room_name)

    def add_to_waiting_list(self):
        self.__class__.channel_name_map[self.user.username] = self.channel_name
        self.__class__.waiting_players.append(self.user.username)

    def remove_from_waiting_list(self):
        print("Dropped from waiting list.")
        if self.user.username in self.__class__.waiting_players:
            self.__class__.waiting_players.remove(self.user.username)

    async def match_players(self):
        if len(self.__class__.waiting_players) >= 2:
            print("Matching players.")
            player1 = await self.get_player_obj(self.__class__.waiting_players.pop(0)) 
            player2 = await self.get_player_obj(self.__class__.waiting_players.pop(0))
            room_name = await self.generate_unique_room_name()

            player1_channel = await self.get_channel_name(player1.username)
            player2_channel = await self.get_channel_name(player2.username)

            await self.channel_layer.group_add(room_name, player1_channel)
            await self.channel_layer.group_add(room_name, player2_channel)

            await self.create_room(room_name,player1, player2)

            await self.channel_layer.group_send(
                room_name,
                {
                    'type': 'start_game',
                    'room_name': room_name
                }
            )

    async def generate_unique_room_name(self):
        while True:
            room_name = f"room_{int(time.time() * 1000)}"
            exists = await self.room_exists(room_name)
            if not exists:
                return room_name

    @sync_to_async
    def room_exists(self, room_name):
        return singleMatch.objects.filter(name=room_name).exists()

    @sync_to_async
    def create_room(self, room_name, player1, player2):
        singleMatch.objects.create(
            name=room_name,
            player1=player1,
            player2=player2,
            is_active=True
        )

    @sync_to_async
    def get_channel_name(self, username):
        return self.__class__.channel_name_map.get(username)

    @sync_to_async
    def is_player_in_active_game(self, username):
        return singleMatch.objects.filter(
            Q(player1__username=username, is_active=True) | Q(player2__username=username, is_active=True)
        ).exists()

    @sync_to_async
    def mark_room_inactive(self):
        room = singleMatch.objects.filter(
            Q(player1__username=self.user.username) | Q(player2__username=self.user.username),
            is_active=True
        ).first()
        if room:
            room.is_active = False
            room.save()
            return room.name
        return None
    
    @sync_to_async 
    def get_player_room(self):
        room = singleMatch.objects.filter(
            Q(player1__username=self.user.username, is_active=True) | Q(player2__username=self.user.username, is_active=True) ).first()
        return room.name
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'room_name': event['room_name'],
            'status': 'start_game'
        }))

    @sync_to_async 
    def get_player_obj(self, username):
        user = User.objects.filter(
            Q(username=username)).first()
        return user
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'room_name': event['room_name'],
            'status': 'start_game'
        }))

    async def notify_opponent(self, room_name):
        await self.channel_layer.group_send(
            room_name,
            {
                'type': 'opponent_left',
                'status': 'leaving'
            }
        )

    async def opponent_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'opponent_left',
            'status': event['status']
        }))
