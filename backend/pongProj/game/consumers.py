import json
import asyncio
from .game import Player, Ball, Net, Canvas, moveBot, PLAYER_HEIGHT, PLAYER_WIDTH
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
# from models import Player
from .models import Room


class GameConsumer(AsyncWebsocketConsumer):
    active_rooms = {}  # Dict
    async def connect(self):

        # me = self.scope['user']
        # user_id = self.scope['url_route']['kwargs']['user_id']
        # try:
        #     user = await Player.objects.aget(ID=user_id)
        #     print(f"user :{user.password}")
        # except User.DoesNotExist:
        #     print(f"User with username {user_id} does not exist.")
        #     await self.close()
        
        # if (user.is_authenticated):
        #     print("loged")
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json.get('id'))


    async def gameStarts(self, event):
        
        # Send message to WebSocket

        await self.send(text_data=json.dumps({
            'status' : "gameStarts"
        }))


    async def watingOpponent(self, event):
        
        # Send message to WebSocket

        await self.send(text_data=json.dumps({
            'status' : "watingOpponent"
        }))