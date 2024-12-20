from django.contrib import admin
from django.urls import path, include
from api.api import api


urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('main.Frontend.urls', namespace='Frontend')),
    path('employees/', include('people.Employees.urls', namespace='Employees')),
    path('api/', api.urls),
    path('labor-tables/', include('finance.LabourCostings.urls', namespace='LabourCostings')),
]
