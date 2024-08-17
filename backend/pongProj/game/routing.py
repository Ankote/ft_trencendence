from django.urls import re_path, path

from . import MatchingConsumer
from . import gameLogicConsumer
from . import tournamentoConsumer
from . import tournamentLogicConsumer

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<user_id>\w+)/$', MatchingConsumer.MatchmakingConsumer.as_asgi()),
    re_path(r'ws/game/(?P<room_name>\w+)/(?P<username>\w+)/$', gameLogicConsumer.GameLogicConsumer.as_asgi()),
    re_path(r'ws/tournament/(?P<type>\w+)/$', tournamentLogicConsumer.TournamentLogicConsumer.as_asgi()),
]