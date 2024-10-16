import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room, singleMatch
from django.db.models import Q
import asyncio
from .game import Player, Ball, Net, Table, PLAYER_WIDTH, PLAYER_HEIGHT, gameOver

#check i players in this room

class GameLogicConsumer(AsyncWebsocketConsumer):
    playing_rooms = {}
    joined_players = 0
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.username = self.scope['url_route']['kwargs']['username']
        self.room_group_name = f'game_{self.room_name}'
        self.room = await self.get_room(self.room_name)
        self.player1 = await self.get_player1(self.room_name)
        self.player2 = await self.get_player2(self.room_name)
        lplayer_infos = await self.player_infos(self.player1)
        rplayer_infos = await self.player_infos(self.player2)
        
        self.__class__.joined_players += 1
        
        # if self.room:
        #     print(f"Player 1: {self.room.player1.username}, Player 2: {self.room.player2.username}")
        # print(f"chanel : {self.channel_name}")
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        # print("here")
        print(self.__class__.joined_players)
        if self.room_group_name not in self.__class__.playing_rooms and  self.__class__.joined_players and  self.__class__.joined_players % 2 == 0:
            self.__class__.playing_rooms[self.room_group_name] = {
                'ball': Ball(),
                'net': Net(),
                'lplayer': Player(1),
                'rplayer': Player(Table.width - PLAYER_WIDTH - 1),
                'table': Table(),
            }
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'pre_match',
                    'action': 'handel_prematch', 
                    'lplayer_obj': lplayer_infos,
                    'rplayer_obj': rplayer_infos,
                })
            # self.__class__.playing_rooms[self.room_group_name]['task'] = asyncio.create_task(self.send_data_periodically())

    async def disconnect(self, close_code):
        print("disconnected")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        if self.room_group_name in self.__class__.playing_rooms:
            if 'task' in self.__class__.playing_rooms[self.room_group_name]:
                self.__class__.playing_rooms[self.room_group_name]['task'].cancel()
            del self.__class__.playing_rooms[self.room_group_name]

    async def receive(self, text_data):
        print("recieved")
        text_data_json = json.loads(text_data)
        print (text_data_json)
        action = text_data_json.get('action')
        if (action == 'start_match'):
            self.__class__.playing_rooms[self.room_group_name]['task'] = asyncio.create_task(self.send_data_periodically())
            pass

        key = text_data_json.get('key')
        # if (action == 'pre_match')
        room = await self.get_room(self.room_name)
        player1 =await  self.get_player1(self.room_name)
        # print(player1)
        # print(self.username)
        if self.room_group_name in self.__class__.playing_rooms:
            game_state = self.__class__.playing_rooms[self.room_group_name]
            if player1.username ==  self.username:
                if key == "ArrowUp":
                    game_state['lplayer'].y -= 20
                if key == "ArrowDown":
                    game_state['lplayer'].y += 20
            else:
                if key == "ArrowUp":
                    game_state['rplayer'].y -= 20
                if key == "ArrowDown":
                    game_state['rplayer'].y += 20

    @sync_to_async
    def get_room(self, room_name):
        try:
            return singleMatch.objects.get(name=room_name)
        except singleMatch.DoesNotExist:
            return None

    @sync_to_async
    def get_player1(self, room_name):
        try:
            return singleMatch.objects.get(name=room_name).player1
        except singleMatch.DoesNotExist:
            return None
        
    async def player_dict(self, player):
        game_state = self.__class__.playing_rooms[self.room_group_name]
        if player == self.player1:  
            score = game_state['lplayer'].score
        else:
            score = game_state['rplayer'].score
        return{
            'first_name' : player.first_name,
            'last_name' : player.last_name,
            'username' : player.username,
            'score': score
        }   
      
    async def player_infos(self, player):
        return{
            'first_name' : player.first_name,
            'last_name' : player.last_name,
            'username' : player.username,
        }
    

    @sync_to_async
    def get_player2(self, room_name):
        try:
            return singleMatch.objects.get(name=room_name).player2
        except singleMatch.DoesNotExist:
            return None

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def send_data_periodically(self):
        game_state = self.__class__.playing_rooms[self.room_group_name]
        while True:
            self.player1_info = await self.player_dict(self.player1)
            self.player2_info = await self.player_dict(self.player2)

            if  gameOver(game_state['lplayer'] ,game_state['rplayer'] ) is  not None:
                await self.endTheGame()
                print("gameover")
                break
            game_state['ball'].update(game_state['lplayer'], game_state['rplayer'])
            data = {
                'type': 'game_state',
                'action': 'changes',
                'player': game_state['lplayer'].to_dict(),
                'opponent': game_state['rplayer'].to_dict(),
                'net': game_state['net'].to_dict(),
                'ball': game_state['ball'].to_dict(),
                'table': game_state['table'].to_dict(),
                'username':self.username,
                'lplayer_obj':self.player1_info,
                "rplayer_obj": self.player2_info
            }

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_stats',
                    'data': data,
                }
            )
            await asyncio.sleep(0.009)
 
    async def pre_match(self, event):
        await self.send(text_data=json.dumps({
            'type': 'pre_match',
            'action': event['action'],
            'lplayer_obj' : event['lplayer_obj'],
            'rplayer_obj' : event['rplayer_obj'],
        }))


    async def game_stats(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

    async def endTheGame(self):
        game_state = self.__class__.playing_rooms[self.room_group_name]
        room = await self.get_room(self.room_name)
        player1 = await self.get_player1(self.room_name)
        player2 = await self.get_player2(self.room_name)
        if gameOver(game_state['lplayer'] ,game_state['rplayer'] ) is game_state['lplayer']:
            self.winner = player1.username
            self.loser = player2.username
            self.winnerScore = game_state['lplayer'].score
            self.loserScore = game_state['rplayer'].score
            await self.save_match_stats(game_state['lplayer'].score, game_state['rplayer'].score)

        if gameOver(game_state['lplayer'] ,game_state['rplayer'] ) is game_state['rplayer']:
            self.winner = player2.username
            self.loser = player1.username
            self.winnerScore = game_state['rplayer'].score
            self.loserScore = game_state['lplayer'].score
            await self.save_match_stats(game_state['lplayer'].score, game_state['rplayer'].score)

        await self.mark_room_inactive()
        if self.room_group_name in self.__class__.playing_rooms:
            if 'task' in self.__class__.playing_rooms[self.room_group_name]:
                self.__class__.playing_rooms[self.room_group_name]['task'].cancel()
            del self.__class__.playing_rooms[self.room_group_name]
        data = {
            'type': 'game_over',
            'action': 'game_over',
            'winner': self.winner,
            'loser' : self.loser,
            'winnerScore' : self.winnerScore,
            'loserScore' : self.loserScore
        }

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_over',
                'data': data,
            }
        )

    async def game_over(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

    async def check_player1_username(self, name):
        # Retrieve the room instance
        room = await self.get_room(self.room_name)
        if room:
            # Compare the name with player1's username
            return name == room.player1.username
        return False
    
    
    @sync_to_async
    def mark_room_inactive(self):
        room = singleMatch.objects.filter(
            Q(name=self.room_name) ,
            is_active=True
        ).first()
        if room:
            room.is_active = False
            room.save()
            return room.name
        return None

    @sync_to_async
    def save_match_stats(self, player1_score, player2_score):
        room = singleMatch.objects.filter(name=self.room_name).first()
        if room:
            print("yes")
            room.is_active = False
            room.player1_score = player1_score
            room.player2_score = player2_score
            room.save()
            return room.name
        return None
    

    @sync_to_async
    def is_room_active(self):
        return singleMatch.objects.filter(
            name=self.room_group_name
        ).exists()