from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TournamentLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.players = []
        self.matches = []
        self.tours = {}
        self.tour = 1

        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']
        print("connected")
        print(f"type : {self.tourType}")
        pass

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
            lplayer = self.tours[self.tour][0][0]
            rplayer = self.tours[self.tour][0][1]
            await self.send(text_data=json.dumps({
                'status': 'start_match',
                'lplayer' : lplayer,
                'rplayer' : rplayer
                    }))

            # self.players.remove(lplayer)
            # self.players.remove(rplayer)
        
        if action == "match_finished":
            pass
        
        if (action == "next_match"):
            print("next match")
        pass

    async def start_tournament(self):
        print( (self.players))
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
        self.tours[len(self.tours) + 1] = self.matches

