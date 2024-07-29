from django.urls import re_path, path

from . import MatchingConsumer
from . import GameLogicConsumer

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<user_id>\w+)/$', MatchingConsumer.MatchmakingConsumer.as_asgi()),
    re_path(r'ws/game/(?P<room_name>\w+)/(?P<username>\w+)/$', GameLogicConsumer.GameLogicConsumer.as_asgi())
]