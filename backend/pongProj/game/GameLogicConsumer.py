
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room


class GameLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'
        self.room = await self.get_room(self.room_name)
            
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # self.remove_from_waiting_list()
        pass


    @sync_to_async
    def get_room(self, room_name):
        try:
            # print("findd")
            # print(f"room   : {room_name}")
            return Room.objects.get(name=room_name)
        except Room.DoesNotExist:
            return None