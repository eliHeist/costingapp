# overheads/models.py
from django.db import models
from project.Projects.models import Project

class OverheadType(models.Model):
    name = models.CharField(max_length=50)
    fixed_cost = models.IntegerField()
    divisor = models.FloatField()
    unit_name = models.CharField(max_length=20, null=True, blank=True)

class OverheadCost(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    type = models.ForeignKey(OverheadType, on_delete=models.CASCADE)
    units = models.FloatField()
