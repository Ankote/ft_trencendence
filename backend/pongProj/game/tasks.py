# pong/tasks.py

from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .game import Ball  # Ensure this import matches your setup

@shared_task
def update_ball_position():
    Ball.update()
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'test',  # Ensure this matches your group name
        {
            'type': 'update_ball_position',
            'ball': Ball.to_dict()
        }
    )
