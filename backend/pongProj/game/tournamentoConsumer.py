from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, tournamentScore, matchTournament, userTournament
import time
import json

class TournamentConsumer(AsyncWebsocketConsumer):
    waiting_players = []
    channel_name_map = {}
    room_name = ""

    async def connect(self):
        self.user = self.scope["user"]
        await self.accept()  # Accept the WebSocket connection
        print("Matching players.")
        
        if not self.__class__.waiting_players:
            self.__class__.room_name = await self.create_tournamentRoom()
            await self.create_tournament(self.__class__.room_name)
            print(self.__class__.room_name)
            print("Matching players.")
        
        await self.add_to_waiting_list()
        await self.match_Players()

    async def disconnect(self, close_code):
        if self.user.username in self.__class__.waiting_players:
            self.__class__.waiting_players.remove(self.user.username)
            del self.__class__.channel_name_map[self.user.username]

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')

        # Handle the incoming message
        print(f"Received message: {message}")

    async def match_Players(self):
        if len(self.__class__.waiting_players) == 4:
            # Logic to match players and start the tournament
            print("Starting tournament with players:", self.__class__.waiting_players)

    async def add_to_waiting_list(self):
        self.__class__.channel_name_map[self.user.username] = self.channel_name
        self.__class__.waiting_players.append(self.user.username)

    async def create_tournamentRoom(self):
        while True:
            room_name = f"tour{int(time.time() * 1000)}"
            exists = await self.room_exists(room_name)
            if not exists:
                return room_name
            
    @sync_to_async
    def create_tournament(self, room_name):
        Tournament.objects.create(
            name = room_name,
        )


    @sync_to_async
    def room_exists(self, room_name):
        return Tournament.objects.filter(name=room_name).exists()
