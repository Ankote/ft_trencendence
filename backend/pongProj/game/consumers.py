import json

from .game import  Player
from channels.generic.websocket import AsyncWebsocketConsumer


# 
player = Player()

class ChatConsumer(AsyncWebsocketConsumer):
    global player
    async def connect(self):
        self.room_group_name = 'test'
        # Add this channel to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(player.x)
    async def disconnect(self, close_code):
        # Remove this channel from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        
        # Send message to the group
        global player
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'player' : player.to_dict()
            }
        )

    async def chat_message(self, event):
        
        # Send message to WebSocket

        global player
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'player' :  player.to_dict()
        }))
