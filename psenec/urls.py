from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', include('main.Frontend.urls', namespace='Frontend')),
    path('employees/', include('people.Employees.urls', namespace='Employees')),
    path('api/', include('api.urls', namespace='api')),
]
