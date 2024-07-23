import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room
import asyncio
from .game import Player, Ball, Net, Table, PLAYER_WIDTH, PLAYER_HEIGHT

class GameLogicConsumer(AsyncWebsocketConsumer):
    playing_rooms = {}

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.username = self.scope['url_route']['kwargs']['username']
        self.room_group_name = f'game_{self.room_name}'
        
        self.room = await self.get_room(self.room_name)
        
        if self.room:
            print(f"Player 1: {self.room.player1}, Player 2: {self.room.player2}")

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        if self.room_group_name not in self.__class__.playing_rooms:
            self.__class__.playing_rooms[self.room_group_name] = {
                'ball': Ball(),
                'net': Net(),
                'lplayer': Player(1),
                'rplayer': Player(Table.width - PLAYER_WIDTH - 1),
                'table': Table(),
            }
            self.__class__.playing_rooms[self.room_group_name]['task'] = asyncio.create_task(self.send_data_periodically())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        if self.room_group_name in self.__class__.playing_rooms:
            if 'task' in self.__class__.playing_rooms[self.room_group_name]:
                self.__class__.playing_rooms[self.room_group_name]['task'].cancel()
            del self.__class__.playing_rooms[self.room_group_name]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        rect = text_data_json.get('rect')
        clientY = text_data_json.get('clientY')

        room = await self.get_room(self.room_name)
        game_state = self.__class__.playing_rooms[self.room_group_name]

        if action == 'moved':
            player_position = clientY - rect['top'] - PLAYER_HEIGHT / 2
            if self.username == room.player1:
                game_state['lplayer'].y = player_position
            else:
                game_state['rplayer'].y = player_position

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

    async def send_data_periodically(self):
        game_state = self.__class__.playing_rooms[self.room_group_name]

        while True:
            game_state['ball'].update(game_state['lplayer'], game_state['rplayer'])
            data = {
                'type': 'game_state',
                'action': 'changes',
                'player': game_state['lplayer'].to_dict(),
                'opponent': game_state['rplayer'].to_dict(),
                'net': game_state['net'].to_dict(),
                'ball': game_state['ball'].to_dict(),
                'table': game_state['table'].to_dict(),
            }

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_stats',
                    'data': data,
                }
            )
            await asyncio.sleep(0.009)

    async def game_stats(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))
