from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, tournamentScore, matchTournament, userTournament, User
import time
import json
from django.db.models import Q


class tournamentLogicConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]['kwargs']['room_name']
        print(self.room_name)
        await self.accept()
        pass

    pass