import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import game.routing

from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pongProj.settings')

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    
    'websocket':AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    )
})