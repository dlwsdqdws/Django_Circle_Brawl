from django.http import HttpResponse

# Create your views here.

def index(request):
    line1 = '<h1 style="text-align:center">Battle Balls</h1>'
    line4 = '<a href="/play/">Go to Play</a>'
    line2 = '<img src="https://thumb.idongdong.com/2019-09/18/16f5d81f24a6ed06.jpeg" width=2000 />'
    line3 = '<hr>'
    return HttpResponse(line1 + line4 + line3 + line2)

def play(request):
    line1 = '<h1>Play Page</h1>'
    line2 = '<a href="/">Back</a>'
    return HttpResponse(line1 + line2)
