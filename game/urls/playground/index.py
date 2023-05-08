from django.urls import path, include
from game.views.playground.getscore import getscore

urlpatterns = [
        path("getscore/", getscore, name="playground_getscore"),
]
