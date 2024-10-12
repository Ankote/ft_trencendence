
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import Player, Ball, Net, Table, PLAYER_WIDTH, PLAYER_HEIGHT, gameOver, movePlayer
import json, asyncio, copy, random
from asgiref.sync import sync_to_async
from .models import Tournament, userTournament, User, singleMatch
from django.db.models import Q
import time

class TournamentRemote(AsyncWebsocketConsumer):
    tour_name = ""
    waiting_players = []
    matches = []
    channel_name_map = {}
    players_name_map = {}
    tours = {}
    match_nbr = 0
    tour = 0
    next_match = 0
    next_player = 0
    next_tour = 0
    tour_obj = None
    async def connect(self):

        await self.accept()
        self.tourType = self.scope['url_route']['kwargs']['type']
        self.user  = self.scope["user"]
        print(self.user)
        self.player = await self.get_player_obj(self.user.username)
        if len (self.__class__.waiting_players) == 0:
            self.create_tournament_dict()
            self.__class__.tour_name = await self.generate_unique_Tournament_name()
            await self.create_Tournament(self.__class__.tour_name, self.getMaxPlayers())
            self.__class__.tour_obj = await self.get_Tournament_obj(self.__class__.tour_name)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')
        username = text_data_json.get('nickname') 

        if action == 'player_joined':
            if (not self.userExists(username)):
                self.add_to_waiting_list(username) # add user to waiting list
                self.playerAlias = username
                await self.player_join_tournament(self.__class__.tour_obj, self.player, self.playerAlias)
                await self.channel_layer.group_add(self.__class__.tour_name, self.channel_name)

            if (len(self.__class__.waiting_players) == 4):
                # for player in self.__class__.channel_name_map
                self.create_matchs()
                print(self.__class__.tours)
                await self.channel_layer.group_send(self.__class__.tour_name,
                {
                    'type': 'start_Tournament',
                    'tournament_stats' : convert_keys_to_strings(self.__class__.tours)
                })

        if action == 'start_match':
            player1_alias = self.__class__.tours[self.__class__.tour][self.__class__.match_nbr][0]
            player2_alias = self.__class__.tours[self.__class__.tour][self.__class__.match_nbr][1]
            player1 = self.__class__.players_name_map[player1_alias]
            player2 =  self.__class__.players_name_map[player2_alias]
            print(self.__class__.players_name_map)
            print(player1_alias)
            print(player2_alias)
            print(player1)
            print(player2)
            # print(self.__class__.players_name_map)
            # room_name = await self.generate_unique_room_name()
            # await self.create_match(room_name, player1, player2)
            print("starts")
            await self.channel_layer.group_send(self.__class__.tour_name,
            {
                'type': 'start_match',
                'action' : "start_match",
                'player1' : player1,
                'player2' : player2,
            })


    async def start_match(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_match',
            'action' : event['action'],
            'player1': event['player2'],
            'player2': event['player2'],
        }))

    async def start_Tournament(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_tournament',
            'action' : "start_tournament",
            'tournament_stats' : event['tournament_stats']
        }))

    def add_to_waiting_list(self, username):
        self.__class__.channel_name_map[self.user.username] = self.channel_name
        self.__class__.players_name_map[username] = self.user.username
        self.__class__.waiting_players.append(username)

    def userExists(self, user):
        return user in self.__class__.waiting_players    
    
    @sync_to_async
    def is_player_in_active_game(self, username):
        return singleMatch.objects.filter(
            Q(player1__username=username, is_active=True) | Q(player2__username=username, is_active=True)
        ).exists()

    def create_matchs(self):
        random.shuffle(self.__class__.waiting_players)
        for i in range(0, len(self.__class__.waiting_players), 2):
            match = self.__class__.waiting_players[i:i + 2]
            self.__class__.matches.append(match)
        self.__class__.tours[self.__class__.tour] = copy.deepcopy(self.__class__.matches)
        self.__class__.matches.clear()

    def create_tournament_dict(self):
        num_players = self.getMaxPlayers()

        # Initialize the round number
        round_number = 0

        # While there are still players left to pair
        while num_players > 1:
            matches = []

            # Create pairs of players   
            for _ in range(num_players // 2):
                matches.append(['', ''])  # Empty strings represent unfilled player slots

            # If there's an odd number of players, one player advances automatically
            if num_players % 2 == 1:
                matches.append([''])  # One player without a match

            # Add the round to the tournament dictionary
            self.__class__.tours[round_number] = matches

            # Update the number of players for the next round
            num_players = len(matches)

            # Move to the next round
            round_number += 1

        # Handle the final match
        if num_players == 1:
            self.__class__.tours[round_number] = [['']]  # Only one player left

    async def  winnerNextTour(self, value):
        for i in range(len(self.__class__.tours)):
            for j in range(len(self.__class__.tours[i])):
                if self.__class__.tours[i][j][0] == '':
                    self.__class__.tours[i][j][0] = value
                    return
                elif self.__class__.tours[i][j][1] == '' :
                    self.__class__.tours[i][j][1] = value
                    return

    @sync_to_async
    def create_Tournament(self, tour_name, maxPlayers):
        Tournament.objects.create(
            name = tour_name,
            is_active = True,
            maxPlayers = maxPlayers,
        )

    async def generate_unique_Tournament_name(self):
        while True:
            tour_name = f"Tour{int(time.time() * 1000)}"
            exists = await self.tour_exists(tour_name)
            if not exists:
                return tour_name
            
    
    @sync_to_async
    def room_exists(self, room_name):
        return singleMatch.objects.filter(name=room_name).exists()
    
    async def generate_unique_room_name(self):
        while True:
            room_name = f"tour_room_{int(time.time() * 1000)}"
            exists = await self.room_exists(room_name)
            if not exists:
                return room_name
                     
    @sync_to_async
    def player_join_tournament(self, tour, player, alias):
        userTournament.objects.create(
            tournament = tour,
            user = player,
            is_active = True,
            user_tournament_name = alias
        )

    @sync_to_async
    def create_match(self, room_name, player1, player2):
        singleMatch.objects.create(
            name=room_name,
            player1=player1,
            player2=player2,
            is_active=True
        )
    
    @sync_to_async
    def tour_exists(self, tour_name):
        return Tournament.objects.filter(name=tour_name).exists()
    
    def getMaxPlayers(self):
        numberPlayers = {
            "tour4": 4,
            "tour8": 8,
            "tour16": 16
        }
        return numberPlayers.get(self.tourType)

    @sync_to_async 
    def get_player_obj(self, username):
        user = User.objects.filter(
            Q(username=username)).first()
        return user    
    
    @sync_to_async 
    def get_player_obj_by_alias(self, alias):
        user = userTournament.objects.filter(
            Q(user_tournament_name=alias)).first().user
        return user   

    @sync_to_async 
    def get_Tournament_obj(self, name):
        tour = Tournament.objects.filter(
            Q(name=name)).first()
        return tour
    

def convert_keys_to_strings(d):
    return {str(key): value for key, value in d.items()}