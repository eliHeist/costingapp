# customers/models.py
from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=100, null=True, blank=True)
    contact_2 = models.CharField(max_length=100, null=True, blank=True)
