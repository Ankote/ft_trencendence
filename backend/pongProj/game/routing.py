from django.urls import re_path, path

from . import MatchingConsumer
from . import gameLogicConsumer
from . import tournamentoConsumer
from . import tournamentLogicConsumer
from . import singleMatchLocalConsumer

websocket_urlpatterns = [
    re_path(r'ws/socket-server/', MatchingConsumer.MatchmakingConsumer.as_asgi()),
    re_path(r'ws/game/(?P<room_name>\w+)/(?P<username>\w+)/$', gameLogicConsumer.GameLogicConsumer.as_asgi()),
    re_path(r'ws/localTournament/(?P<type>\w+)/$', tournamentLogicConsumer.TournamentLogicConsumer.as_asgi()),
    re_path(r'ws/remoteTournament/(?P<type>\w+)/$', tournamentoConsumer.TournamentRemote.as_asgi()),
    re_path(r'ws/localSingle/', singleMatchLocalConsumer.SingleMatchLocalConsumer.as_asgi())
]