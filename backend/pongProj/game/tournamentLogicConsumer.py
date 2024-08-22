from channels.generic.websocket import AsyncWebsocketConsumer
from .game import Player, Ball, Net, Table, PLAYER_WIDTH, PLAYER_HEIGHT, gameOver, movePlayer
import json, asyncio

class TournamentLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.players = []
        self.matches = []
        self.tours = {}
        self.match_nbr = 0
        self.tour = 0

        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action= text_data_json.get('action')
        if (action == "player_joined"):
            user = text_data_json.get('user')
            if not self.userExists(user):
                self.players.append(user)
                await self.start_tournament()
            else:    
                await self.send(text_data=json.dumps({
                        'status': 'userFound'
                    }))
        if action == "start_tournament":
            self.create_matchs()
        if action == "start_match":
            
            self.game_state = {
                'ball': Ball(),
                'net': Net(),
                'lplayer': Player(1),
                'rplayer': Player(Table.width - PLAYER_WIDTH - 1),
                'table': Table(),
            }
            self.task = asyncio.create_task(self.send_data_periodically())
        
        if action == "move_player":

            key = text_data_json.get('key')
            if key == "ArrowUp" or key == "ArrowDown" or key == "w" or key == "s":
                movePlayer(key, self.game_state['lplayer'], self.game_state['rplayer'], self.game_state['table']) 
         
        
        if action == "match_finished":
            pass
        
        if (action == "next_match"):
            if self.match_nbr == len (self.tours[self.tour]) :
                self.matches.clear()
                self.create_matchs()
                # print(self.players)
            else:
                self.game_state = {
                    'ball': Ball(),
                    'net': Net(),
                    'lplayer': Player(1),
                    'rplayer': Player(Table.width - PLAYER_WIDTH - 1),
                    'table': Table(),
                }
            self.task =  asyncio.create_task(self.send_data_periodically())
            pass    
        pass

    async def start_tournament(self):
        # print( (self.players))
        if len (self.players) == self.getMaxPlayers():
            print("tournament starts")
            await self.send(text_data=json.dumps({
                    'status': 'start_tournament',
                }))
    
    def getMaxPlayers(self):
        numberPlayers = {
            "tour4": 4,
            "tour8": 8,
            "tour16": 16
        }
        return numberPlayers.get(self.tourType)

    def userExists(self, user):
        return user in self.players
    
    def create_matchs(self):
        for i in range(0, len(self.players), 2):
            match = self.players[i:i + 2]
            self.matches.append(match)
        self.tours[len(self.tours)] = self.matches


    async def send_data_periodically(self):

        while True:
            if  gameOver(self.game_state['lplayer'] ,self.game_state['rplayer'] ) is  not None:
                await self.endGame()
                self.close
                break
            self.game_state['ball'].update(self.game_state['lplayer'], self.game_state['rplayer'])
            data = {
                'status': 'start_match',
                'lplayer': self.game_state['lplayer'].to_dict(),
                'rplayer': self.game_state['rplayer'].to_dict(),
                'net': self.game_state['net'].to_dict(),
                'ball': self.game_state['ball'].to_dict(),
                'table': self.game_state['table'].to_dict(),
                'lplayer_name' : self.tours[self.tour][0][0],
                'rplayer_name' : self.tours[self.tour][0][1]
            }
            await self.send(text_data=json.dumps({
                    'status': 'changes',
                    'game_state': data,
                    }))
            await asyncio.sleep(0.009)


    async def endGame(self):
        # print(self.tour)
        print(self.tours)
        winner = gameOver(self.game_state['lplayer'] ,self.game_state['rplayer'] )
        if winner == self.game_state['lplayer']:
            self.players.remove(self.tours[self.tour][self.match_nbr][0])
        else:
            self.players.remove(self.tours[self.tour][self.match_nbr][1])
        
        self.match_nbr += 1
        # print(self.players)
        self.task.cancel()  

        await self.send(text_data=json.dumps({
                'status': 'game_over',
                }))
        pass