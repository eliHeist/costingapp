from django.urls import path
from . import views

app_name = 'Projects'

urlpatterns = [
    path('', views.ProjectsView.as_view(), name='projects'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='detail'),
    path('<int:pk>/edit/', views.ProjectsFormView.as_view(), name='edit'),
]