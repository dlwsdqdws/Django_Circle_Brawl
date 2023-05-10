from django.urls import path
from game.views.menu.rank.get_total_page import RankScoreTotalPageView
from game.views.menu.rank.get_rank import RankScoreListView
from game.views.menu.rank.get_list import RankScorePageListView

urlpatterns = [
    path("rank/getpage/", RankScoreTotalPageView.as_view(), name="menu_get_page"),
    path("rank/getplayers/", RankScoreListView.as_view(), name="menu_get_score_rank"),
    path("rank/getplayers/<int:page>/", RankScorePageListView.as_view(), name="menu_get_score_page_rank"),
]
