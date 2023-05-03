from django.urls import path
from game.views.settings.acw.web.apply_code import apply_code as web_apply_code
from game.views.settings.acw.web.receive_code import receive_code as web_receive_code
from game.views.settings.acw.app.apply_code import apply_code as app_apply_code
from game.views.settings.acw.app.receive_code import receive_code as app_receive_code

urlpatterns = [
        path("web/apply_code/", web_apply_code, name="settings_acw_web_apply_code"),
        path("web/receive_code/", web_receive_code, name="settings_acw_web_receive_code"),
        path("app/apply_code/", app_apply_code, name="settings_acw_app_apply_code"),
        path("app/receive_code/", app_receive_code, name="settings_acw_app_receive_code"),
]

