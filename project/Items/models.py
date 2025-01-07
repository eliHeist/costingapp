from django.db import models

from finance.LabourCostings.models import ItemCosting, ItemType
from people.Employees.models import Employee
from project.Projects.models import Project

# Create your models here.
class ItemGroup(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='item_groups')
    description = models.CharField(max_length=255)
    type = models.ForeignKey(ItemType, on_delete=models.CASCADE)

class Item(models.Model):
    item_group = models.ForeignKey(ItemGroup, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.FloatField()
    height = models.FloatField()
    length = models.FloatField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    costing = models.ForeignKey(ItemCosting, on_delete=models.CASCADE)
    
    def area(self):
        return self.height * self.length
    
    def fabricationCost(self):
        return self.area() * self.costing.fabrication_cost
    
    def sprayingCost(self):
        return self.area() * self.costing.spraying_cost