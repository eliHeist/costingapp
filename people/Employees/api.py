from .schemas import Employee, EmployeeSchema
from ninja import NinjaAPI

api = NinjaAPI()

@api.get("", response=list[EmployeeSchema])
def get_employees(request):
    return Employee.objects.all()

@api.post("", response=EmployeeSchema)
def add_employee(request, employee: EmployeeSchema):
    return Employee.objects.create(**employee.dict())
