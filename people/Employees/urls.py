from django.urls import path
from people.Employees.api import api

from . import views

app_name = 'Employees'

urlpatterns = [
    path('', views.EmployeeListView.as_view(), name='employee-list'),
    path('api/', api.urls, name="api"),
]