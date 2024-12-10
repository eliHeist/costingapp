from django.urls import path
from api.api import api

app_name = 'api'

urlpatterns = [
    path('', api.urls, name='api')
]