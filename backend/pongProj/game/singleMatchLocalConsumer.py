from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .game import Player, Ball, Net, Table, PLAYER_WIDTH, PLAYER_HEIGHT, gameOver, movePlayer
import asyncio

class SingleMatchLocalConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        self.game_state = {
            'ball': Ball(),
            'net': Net(),
            'lplayer': Player(20),
            'rplayer': Player(Table.width - PLAYER_WIDTH - 20),
            'table': Table(),
        }
        await self.send(text_data=json.dumps({
                    'action': 'custom_match',
                    }))
        print("youu")

    async def receive(self, text_data):

        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        if action and action == 'startGame':
            print("startde")
            await self.send(text_data=json.dumps({
                    'action': 'startGame'
                    }))
            asyncio.create_task(self.send_data_periodically())
        elif action == "move_player":
            key = text_data_json.get('key')
            movePlayer(key, self.game_state['lplayer'], self.game_state['rplayer'], self.game_state['table']) 

        pass

    async def disconnect(self, close_code):
        print(close_code)
        pass

    async def send_data_periodically(self):

        while True:
            if  gameOver(self.game_state['lplayer'] ,self.game_state['rplayer'] ) is  not None:
                await self.endGame()
                self.close
                break
            self.game_state['ball'].update(self.game_state['lplayer'], self.game_state['rplayer'])
            data = {
                'lplayer': self.game_state['lplayer'].to_dict(),
                'rplayer': self.game_state['rplayer'].to_dict(),
                'net': self.game_state['net'].to_dict(),
                'ball': self.game_state['ball'].to_dict(),
                'table': self.game_state['table'].to_dict(),
                'name' : 'alaoui ali'

            }
            await self.send(text_data=json.dumps({
                    'action': 'changes',
                    'game_state': data,
                    }))
            await asyncio.sleep(0.009)

    async def endGame(self):
        await self.send(text_data=json.dumps({
                'action': 'game_over',
                }))
        pass


    pass