from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<user_id>\w+)/$', consumers.GameConsumer.as_asgi())
]