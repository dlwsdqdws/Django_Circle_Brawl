from django.core.paginator import Paginator
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from game.models.player.player import Player

class RankScoreTotalPageView(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        players = Player.objects.all()
        paginator = Paginator(players, settings.RANK_LIST_NUM)

        return Response({
            'result': 'success',
            'page_count': paginator.num_pages,
        })
