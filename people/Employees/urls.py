from django.urls import path

from . import views

app_name = 'Employees'

urlpatterns = [
    path('', views.EmployeeListView.as_view(), name='employee-list'),
]