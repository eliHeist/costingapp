# expenses/models.py
from django.db import models
from project.Projects.models import Project

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100)

class Expense(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    amount = models.IntegerField()
