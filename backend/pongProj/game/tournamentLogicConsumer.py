from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, tournamentScore, matchTournament, userTournament, User

class tournamentLogicConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]['kwargs']['room_name']
        await self.accept()
        
        players = await self.get_players()
        if players: 
            for player in players:
                print(player)

    @sync_to_async
    def get_players(self):
        tournament = Tournament.objects.filter(name=self.room_name).first()
        if tournament:
            players = userTournament.objects.filter(tournament=tournament).all()
            if players.exists():
                return [player.user for player in players]
            else:
                return []
        else:
            return []