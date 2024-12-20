# costings/models.py
from django.db import models

class ItemType(models.Model):
    name = models.CharField(max_length=100)

class CostingMethod(models.TextChoices):
    PER_UNIT = 'PU', 'Per Unit'
    BY_MEASUREMENTS = 'BM', 'By Measurements'
    
class Units(models.TextChoices):
    METER = 'm', 'Meter'
    CENTIMETER = 'cm', 'Centimeter'
    MILLIMETER = 'mm', 'Millimeter'
    SQUARE_METER = 'sqm', 'Square Meter'
    INCH = 'in', 'Inch'
    FEET = 'ft', 'Feet'
    
        
class ItemCosting(models.Model):
    name = models.CharField(max_length=50)
    table = models.ForeignKey('LabourTable', on_delete=models.CASCADE, related_name='item_costings')
    type = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    code = models.CharField(max_length=50)
    fabrication_cost = models.DecimalField(max_digits=10, decimal_places=0)
    spraying_cost = models.DecimalField(max_digits=10, decimal_places=0)
    costing_method = models.CharField(max_length=5, choices=CostingMethod.choices)
    unit_name = models.CharField(max_length=20, choices=Units.choices)
    min_height = models.FloatField(null=True, blank=True)
    min_length = models.FloatField(null=True, blank=True)
    max_height = models.FloatField(null=True, blank=True)
    max_length = models.FloatField(null=True, blank=True)
    

class LabourTable(models.Model):
    effective_start_date = models.DateField()
    effective_end_date = models.DateField()
    
    def get_all_units(self):
        return [{'symbol': unit.value, 'name': unit.label} for unit in Units]
