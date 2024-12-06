from django.urls import path
from main.Frontend import views

app_name = 'Frontend'

urlpatterns = [
    path('', views.LandingView.as_view(), name='landing')
]