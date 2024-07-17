from django.urls import re_path, path

from . import consumers
from . import GameLogicConsumer

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<user_id>\w+)/$', consumers.MatchmakingConsumer.as_asgi()),
    re_path(r'ws/game/(?P<room_name>\w+)/$', GameLogicConsumer.GameLogicConsumer.as_asgi())
]