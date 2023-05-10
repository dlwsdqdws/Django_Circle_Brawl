from django.core.paginator import Paginator
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player

class RankScorePageListView(APIView):
    # permission_classes = ([IsAuthenticated])

    def get(self, request, page):
        players = Player.objects.all().order_by('-score')
        paginator = Paginator(players, settings.RANK_LIST_NUM)
        player_list = paginator.get_page(page).object_list
        players = []
        for player in player_list:
            pd = {}
            pd['name'] = player.user.username
            pd['photo'] = player.photo
            pd['score'] = player.score
            players.append(pd)

        return Response({
            'result': 'success',
            'players': players,
        })
