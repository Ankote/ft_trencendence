import json
import asyncio
from .game import Player, Ball, Net, Canvas, moveBot, PLAYER_HEIGHT, PLAYER_WIDTH
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User
# from models import Player
from .models import Room


class MatchmakingConsumer(AsyncWebsocketConsumer):
    waiting_players = []
    active_rooms = {}
    room_name = ""
    async def connect(self):
        print(f"Player : {self.channel_name}")
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            # print(f"user {self.user.username} is connected")
            self.add_to_waiting_list()
            await self.match_players()
            await self.accept()
        else:
            # print("disconnected")
            await self.close()
    

    async def disconnect(self, close_code):

        # self.remove_from_waiting_list()
        pass


    def add_to_waiting_list(self):
        self.__class__.waiting_players.append(self.channel_name)


    def remove_from_waiting_list(self):
        # print("disconnected")
        if self.channel_name in self.__class__.waiting_players:
            self.__class__.waiting_players.remove(self.channel_name)

    async def match_players(self):
        # print( len(self.__class__.waiting_players))
        if len(self.__class__.waiting_players) >= 2:
            player1 = self.__class__.waiting_players.pop(0)
            player2 = self.__class__.waiting_players.pop(0)
            room_name = f"room_{len(self.__class__.active_rooms)}"
            self.__class__.active_rooms[room_name] = [player1, player2]


            await self.channel_layer.group_add(room_name, player1)
            await self.channel_layer.group_add(room_name, player2)
            
            # Save the room to the database
            await self.create_room(room_name, player1, player2)
            await self.channel_layer.group_send(
                room_name,
                {
                    'type': 'start_game',
                    'room_name': room_name
                }
            )
            # print(f"ROOM : {room_name} CREATED")
    @sync_to_async
    def create_room(self, room_name, player1, player2):
        Room.objects.create(
            name=room_name,
            player1=player1,
            player2=player2
        )


    
    async def start_game(self, event):
        # Sending a message to the WebSocket (asynchronous operation)
        # print(event['room_name'])
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'room_name':  event['room_name'],
            'status' : "start_game"
        }))
    
    # def generateRoomName(self)
    # {

    # }