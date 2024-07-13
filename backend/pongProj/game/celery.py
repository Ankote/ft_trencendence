# your_project_name/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pongProj')

app = Celery('pongProj')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


# celery.py


# app.conf.beat_schedule = {
#     'update-ball-position-every-second': {
#         'task': 'pongProj.tasks.update_ball_position',
#         'schedule': 1.0,  # Every second
#     },
# }
