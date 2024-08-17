from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, singleMatch, matchTournament, userTournament, User
import time
import json
from django.db.models import Q

class TournamentConsumer(AsyncWebsocketConsumer):
    waiting_players = []
    channel_name_map = {}
    nickname_map = {}
    room_name = ""

    async def connect(self):
        self.user = self.scope["user"]
        self.nickname = self.scope['url_route']['kwargs']['nickname']
        await self.accept()  # Accept the WebSocket connection
        print("Matching players.")
        
        if not self.__class__.waiting_players:
            self.__class__.room_name = await self.create_tournamentRoom()
            await self.create_tournament(self.__class__.room_name)
            print(self.__class__.room_name)
            print("Matching players.")
        
        await self.channel_layer.group_add(self.__class__.room_name, self.channel_name)
        await self.channel_layer.group_send(
            self.__class__.room_name ,
            {
                'type'      : 'tournament_created',
                'status'    : "waiting"
            }
        )
        await self.add_to_waiting_list()
        await self.match_Players()

    async def disconnect(self, close_code):
        if self.user.username in self.__class__.waiting_players:
            self.__class__.waiting_players.remove(self.user.username)
            del self.__class__.channel_name_map[self.user.username]
            del self.__class__.nickname_map[self.user.username]

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')

        # Handle the incoming message
        print(f"Received message: {message}")

    async def match_Players(self):
        tour_obj = await self.get_tour_obj(self.__class__.room_name)
        if len(self.__class__.waiting_players) == 2 :
            print("players joined")
            for player in self.__class__.waiting_players:
                player_obj = await self.get_player_obj(player)
                player_nickname = self.__class__.nickname_map[player]
                await self.tournament_add_Player(player_obj, tour_obj, player_nickname)
                players = await self.get_players()
                # await self.create_matches(tour_obj)
            
            await self.channel_layer.group_send(
                self.__class__.room_name ,
                {
                    'type'   :  'start_game',
                    'room_name' :  self.__class__.room_name,
                    'status' : 'start_game',
                    # 'players' :  self.__class__.nickname_map
                })
              
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'status'    : event['status'],
            'room_name' : event['room_name'],
        }))
  
    async def add_to_waiting_list(self):
        self.__class__.channel_name_map[self.user.username] = self.channel_name
        self.__class__.nickname_map[self.user.username] = self.nickname
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
            is_active= True
        )  

    @sync_to_async
    def tournament_add_Player(self, player, tour, nickname):
        userTournament.objects.create(
            user = player,
            tournament = tour,
            user_tournament_name = nickname
        )
        print (f"nick: {self.nickname}")

    @sync_to_async
    def room_exists(self, room_name):
        return Tournament.objects.filter(name=room_name).exists()


    @sync_to_async 
    def get_player_obj(self, username):
        user = User.objects.filter(
            Q(username=username)).first()
        return user
    
    @sync_to_async 
    def get_tour_obj(self, room_name):
        tour = Tournament.objects.filter(
            Q(name=room_name)).first()
        return tour
    
    async def tournament_created(self, event):
        await self.send(text_data=json.dumps({
            'status'    : event['status']
        }))

    @sync_to_async
    def get_players(self):
        tournament = Tournament.objects.filter(name=self.room_name).first()
        if tournament:
            players = userTournament.objects.filter(tournament=tournament).all()
            return [player for player in players]
        return []
