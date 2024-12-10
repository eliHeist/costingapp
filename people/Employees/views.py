from django.shortcuts import render
from django.views import generic, View
from .models import Employee

# Create your views here.
class EmployeeListView(generic.ListView):
    model = Employee
    template_name = 'Employees/employee-list.html'
    context_object_name = 'employees'

    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)