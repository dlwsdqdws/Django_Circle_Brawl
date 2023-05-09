from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from game.models.player.player import Player

class PlayerView(APIView):
    def post(self, request):
        data = request.POST
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        password_confirm = data.get("password_confirm", "").strip()

        if not username or not password:
            return Response({
                'result': "Username/Password cannot be empty",
                })

        if password != password_confirm:
            return Response({
                'result': "Passwords entered do not match",
                })

        if User.objects.filter(username=username).exists():
            return Response({
                'result': "Username cannot be used",
                })

        user = User(username=username)
        user.set_password(password)
        user.save()
        Player.objects.create(user=user, photo="https://s.yimg.com/ny/api/res/1.2/Ib125.p_WkIp4Izs68LtwQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTM1NDtoPTUwMA--/https://media.zenfs.com/zh-Hant-HK/News/Unwire.hk/1333524568-204358970.jpg")
        return Response({
            'result': "success",
            })
