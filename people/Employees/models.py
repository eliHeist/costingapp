# employees/models.py
from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=100)
    contact_2 = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)
