# projects/models.py
from django.db import models
from people.Customers.models import Customer

class Project(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    cost_to_customer = models.IntegerField(null=True, blank=True)
