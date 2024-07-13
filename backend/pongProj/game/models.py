from django.db import models
from django.contrib.auth.models import AbstractUser

# class Players(models.Model):
#     userID = models.models.IntegerField(_("1"))
#     username = models.CharField()    
#     pass


class CustomUser(AbstractUser):

    first_name = models.CharField(max_length=255)

    def __str__(self):
        return self.username
    
    pass

    
class Room(models.Model):
    name = models.CharField(max_length=255, unique=True)
    player1 = models.CharField(max_length=255)
    player2 = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# Create your models here.
