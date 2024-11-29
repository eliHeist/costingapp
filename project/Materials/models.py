# materials/models.py
from django.db import models
from project.Projects.models import Project

class MaterialGroup(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    supplier = models.CharField(max_length=100, null=True, blank=True)
    receipt_number = models.CharField(max_length=100, null=True, blank=True)
    file = models.FileField(null=True, blank=True)

class Material(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    group = models.ForeignKey(MaterialGroup, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100)
    cost = models.IntegerField()
