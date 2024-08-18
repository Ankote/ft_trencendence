from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TournamentLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']
        print("connected")
        print(f"type : {self.tourType}")
        pass

    async def receive(self, text_data):
        print("message recieved")
        text_data_json = json.loads(text_data)
        print(text_data_json)
        pass
