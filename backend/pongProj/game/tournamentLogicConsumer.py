from channels.generic.websocket import AsyncWebsocketConsumer

class TournamentLogicConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']
        print("connected")
        print(f"type : {self.tourType}")
        pass

