from django.urls import path
from . import views

app_name = 'LabourCostings'

urlpatterns = [
    path('', views.LaborFeesView.as_view(), name='labor-table'),
    path('add/', views.LaborFeesCreateView.as_view(), name='labor-table-create'),
    path('<int:pk>/edit/', views.LaborFeesEditView.as_view(), name='labor-table-edit'),
]
