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
        if self.user.is_authenticated:
            player = await self.get_player_obj(self.user)
            player_infos = await self.player_dict(player)
            await self.accept()
            print(f"player :{player_infos}")
            if self.user.username in self.__class__.waiting_players:
                print("deja")
                await self.accept()
                await self.send(text_data=json.dumps({
                        'status': 'deja',
                        'username': self.user.username,
                        }))
                
            elif await self.is_player_in_active_game(self.user.username):
                print("player already in game!")
            else:
                self.add_to_waiting_list()
                if (len (self.waiting_players) == 1):
                    order = 1
                else:
                    order = 12  

                await self.send(text_data=json.dumps({
                        'status': 'waiting_opponent',
                        'player': player_infos,
                        'image': f'./images/{self.user.username}.jpeg',
                        'order' : order
                        }))
                await self.match_players()

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

    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     action = text_data_json.get('action')
    #     if action == "start_match":
    #         await self.channel_layer.group_send(room_name,
                                                
    #                                             )

    def add_to_waiting_list(self):
        self.__class__.channel_name_map[self.user.username] = self.channel_name
        self.__class__.waiting_players.append(self.user.username)

    def remove_from_waiting_list(self):
        print("Dropped from waiting list.")
        if self.user.username in self.__class__.waiting_players:
            self.__class__.waiting_players.remove(self.user.username)

    async def  match_players(self):
        if len(self.__class__.waiting_players) >= 2:
            player1 = await self.get_player_obj(self.__class__.waiting_players.pop(0)) 
            player2 = await self.get_player_obj(self.__class__.waiting_players.pop(0))
            player1_infos = await self.player_dict(player1)
            player2_infos = await self.player_dict(player2)
            room_name = await self.generate_unique_room_name()

            player1_channel = await self.get_channel_name(player1.username)
            player2_channel = await self.get_channel_name(player2.username)

            await self.channel_layer.group_add(room_name, player1_channel)
            await self.channel_layer.group_add(room_name, player2_channel)

            await self.create_match(room_name,player1, player2)
            await self.channel_layer.group_send(
                room_name,
                {
                    'type': 'players_matched',
                    'room_name': room_name,
                    'player1' : player1_infos,
                    'player2' : player2_infos,
                    'player1Image' : './images/aankote.jpeg',
                    'player2Image' : './images/aayoub.jpeg'
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
    def create_match(self, room_name, player1, player2):
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
    
    async def players_matched(self, event):
        await self.send(text_data=json.dumps({
            'type': 'players_matched',
            'room_name': event['room_name'],
            'status': 'players_matched',
            'player1' : event['player1'],
            'player2' : event['player2'],
            'player1Image' : event['player1Image'],
            'player2Image' :  event['player2Image']
        }))

    @sync_to_async 
    def get_player_obj(self, username):
        user = User.objects.filter(
            Q(username=username)).first()
        return user

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
            
    async def player_dict(self, player):
        return{
            'first_name' : player.first_name,
            'last_name' : player.last_name,
            'username' : player.username,
        }