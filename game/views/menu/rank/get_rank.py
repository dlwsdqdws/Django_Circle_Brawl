from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player


class RankScoreListView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        me = Player.objects.get(user=request.user)
        player_list = Player.objects.all().order_by('-score')
        players = []
        players.append({
            'rank': Player.objects.filter(score__gt=me.score).count() + 1,
            'name': me.user.username,
            'photo': me.photo,
            'score': me.score
        })
        for player in player_list:
            pd = {}
            pd['rank'] = Player.objects.filter(score__gt=player.score).count() + 1
            pd['name'] = player.user.username
            pd['photo'] = player.photo
            pd['score'] = player.score
            players.append(pd)

        return Response({
            'result': 'success',
            'players': players,
        })
