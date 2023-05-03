from django.http import JsonResponse
from urllib.parse import quote
from django.core.cache import cache
from random import randint


def get_state():
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res

def apply_code(request):
    appid = "4415"
    redirect_uri = quote("https://app4415.acapp.acwing.com.cn/settings/acw/app/receive_code/")
    scope = "userinfo"
    state = get_state()
    
    cache.set(state, True, 7200)

    return JsonResponse({
            'result': "success",
            'appid': appid,
            'redirect_uri': redirect_uri,
            'scope': scope,
            'state': state,
        })
