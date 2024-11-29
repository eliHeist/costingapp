# quotations/models.py
from django.db import models
from project.Projects.models import Project
from people.Users.models import User
from people.Employees.models import Employee
from finance.LabourCostings.models import ItemCosting

class Quotation(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=255, null=True, blank=True)

class QuotationGroup(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    quotation = models.ForeignKey(Quotation, on_delete=models.SET_NULL, null=True)
    description = models.CharField(max_length=255)

class QuotationItem(models.Model):
    quotation_group = models.ForeignKey(QuotationGroup, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    quantity = models.FloatField()
    height = models.FloatField()
    length = models.FloatField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    costing = models.ForeignKey(ItemCosting, on_delete=models.CASCADE)
