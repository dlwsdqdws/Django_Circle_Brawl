from django.urls import path
from game.views.settings.acw.web.apply_code import apply_code
from game.views.settings.acw.web.receive_code import receive_code

urlpatterns = [
        path("web/apply_code/", apply_code, name="settings_acw_web_apply_code"),
        path("web/receive_code/", receive_code, name="settings_acw_web_receive_code"),
]

