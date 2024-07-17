from django.db import models
from django.contrib.auth.models import AbstractUser

class Players(models.Model):
    username = models.CharField(max_length=255)   
    def __str__(self):
        return self.username 


class User(AbstractUser):
    first_name  = models.CharField(max_length=255)
    name        =  models.CharField(max_length=255)
    dahmad =  models.CharField(max_length=255, blank=True)
    # You can add other custom fields here

    def __str__(self):
        return self.name
    
class Room(models.Model):
    name = models.CharField(max_length=255, unique=True)
    player1 = models.CharField(max_length=255)
    player2 = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

# Create your models here.
