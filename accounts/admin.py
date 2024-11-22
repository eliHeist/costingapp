from atexit import register
from django.contrib import admin

from accounts.models import User

# Register your models here.
admin.site.site_header = 'MBF Auto Garage'

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'is_admin', 'is_technician', 'is_superuser']
    list_filter = ['is_admin', 'is_technician', 'is_account_staff', 'groups']
    search_fields = ['first_name', 'last_name', 'username', 'email', 'phone_1', 'phone_2']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        (None, {'fields': ('username', 'first_name', 'last_name', 'email', 'gender', 'profile_picture')}),
        ('Permissions', {'fields': ('is_active', 'is_admin', 'is_technician', 'is_account_staff', 'is_superuser')}),
        ('Preferences', {'fields': ('dark_theme',)}),
        ('Contact Information', {'fields': ('phone_1', 'phone_2')}),
        ('Important dates', {'fields': ('created_at', 'updated_at')}),
        ('User auth permissions', {'fields': ('user_permissions', 'groups')}),
    )
