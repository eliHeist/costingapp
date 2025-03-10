from django.urls import path
from . import views

app_name = 'Projects'

urlpatterns = [
    path('', views.ProjectsView.as_view(), name='projects'),
    path('create/', views.ProjectsCreateView.as_view(), name='create'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='detail'),
    path('<int:pk>/particulars/', views.ProjectParticularsView.as_view(), name='particulars'),
    path('<int:pk>/expenses/', views.ProjectExpensesView.as_view(), name='expenses'),
    path('<int:pk>/edit/', views.ProjectsFormView.as_view(), name='edit'),
]