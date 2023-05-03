from django.contrib import admin

# Register your models here.
from game.models.player.player import Player

admin.site.register(Player)
