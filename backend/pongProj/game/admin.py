from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import User
from .models import Room
# from .models import FriendShip
# from .models import singleMatch
# from .models import Tournament
# from .models import matchTournament
# from .models import tournamentScore
# from .models import userTournament



admin.site.register(User)
admin.site.register(Room)
# admin.site.register(FriendShip)
# admin.site.register(singleMatch)
# admin.site.register(Tournament)
# admin.site.register(matchTournament)
# admin.site.register(tournamentScore)
# admin.site.register(userTournament)