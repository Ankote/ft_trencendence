
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room
import asyncio
from .game import Player, Ball, Net, Canvas, PLAYER_WIDTH


class GameLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']


        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.username = self.scope['url_route']['kwargs']['username']
        print(f"User ID: {self.room_name}, Username: {self.username}")

        self.room_group_name = f'game_{self.room_name}'
        self.room = await self.get_room(self.room_name)
        room = await self.get_room(self.room_name)
        if room is not None:
            print(f"player 1 : {room.player1} player 2 : {room.player2}")

        self.game_state = {
                'ball':      Ball(),
                'net':       Net(),
                'lplayer':   Player(1),
                'rplayer':   Player(Canvas.width - PLAYER_WIDTH - 1)
            }
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        asyncio.create_task(self.send_data_periodically())


    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        # text_data_json  = json.loads(text_data)
        room = await self.get_room(self.room_name)
        # if (self.username == room.player1):
        #     print("player 1 moved")
        # else:
        #     print("player 2 moved")
        #     pass
        pass

    @sync_to_async
    def get_room(self, room_name):
        try:
            return Room.objects.get(name=room_name)
        except Room.DoesNotExist:
            return None
        
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

        pass
    
    @sync_to_async
    def get_player(seff, room_name):
        room = Room.objects.filter(name=room_name).first()
        return room
    
    async def send_data_periodically(self):
        while True:
            self.game_state['ball'].update(self.game_state['lplayer'], self.game_state['rplayer'])
            data = {
                'type'      :   'game_state',
                'action'     : 'changes',
                'player'    :   self.game_state['lplayer'].to_dict(),
                'opponent'  :   self.game_state['rplayer'].to_dict(),
                'net'       :   self.game_state['net'].to_dict(),
                'ball'      :   self.game_state['ball'].to_dict(),
                # 'canvas'      :   self.game_state['canvas'].to_dict(),

            }
            # Send the data to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type'  : 'game_stats',
                    'data'  : data,
                }
            )
            await asyncio.sleep(0.01)

    async def game_stats(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))