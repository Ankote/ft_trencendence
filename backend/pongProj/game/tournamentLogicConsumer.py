from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TournamentLogicConsumer(AsyncWebsocketConsumer):
    players = []
    async def connect(self):
        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']
        print("connected")
        print(f"type : {self.tourType}")
        self.start_tournament()
        pass

    async def receive(self, text_data):
        print("message recieved")
        text_data_json = json.loads(text_data)
        # print(text_data_json)

        if not self.userExists(text_data_json.get('user')):
            self.players.append(text_data_json.get('user'))
        else:    
            await self.send(text_data=json.dumps({
                    'message': 'userFound'
                }))

        self.start_tournament()
        pass

    def start_tournament(self):
        if len (self.players) == self.getMaxPlayers():
            print("finished")
    
    def getMaxPlayers(self):
        numberPlayers = {
            "tour4": 4,
            "tour8": 8,
            "tour16": 16
        }
        return numberPlayers.get(self.tourType)

    def userExists(self, user):
        return user in self.players
