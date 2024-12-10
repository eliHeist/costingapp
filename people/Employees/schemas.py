from ninja import ModelSchema
from .models import Employee

class EmployeeSchema(ModelSchema):
    class Meta:
        model = Employee
        fields = ('id', 'name', 'contact', 'contact_2', 'is_active')