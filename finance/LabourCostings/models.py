# costings/models.py
from django.db import models

class ItemType(models.Model):
    name = models.CharField(max_length=100)

class CostingMethod(models.TextChoices):
    PER_UNIT = 'PU', 'Per Unit'
    BY_MEASUREMENTS = 'BM', 'By Measurements'
        
class ItemCosting(models.Model):
    type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    code = models.CharField(max_length=50)
    fabrication_cost = models.IntegerField()
    spraying_cost = models.IntegerField()
    costing_method = models.CharField(max_length=5, choices=CostingMethod.choices,)
    unit_name = models.CharField(max_length=20, null=True, blank=True)
    min_height = models.FloatField(null=True, blank=True)
    min_length = models.FloatField(null=True, blank=True)
    max_height = models.FloatField(null=True, blank=True)
    max_length = models.FloatField(null=True, blank=True)

class LabourTable(models.Model):
    item_costings = models.ManyToManyField(ItemCosting)
    effective_start_date = models.DateField()
    effective_end_date = models.DateField()
