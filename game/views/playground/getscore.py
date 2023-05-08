from django.http import JsonResponse
from game.models.player.player import Player

def getscore(request):
    user = request.user
    
    player = Player.objects.get(user=user)
    return JsonResponse({
        'result': "success",
        'msg': "get_score",
        'score': player.score
    })
