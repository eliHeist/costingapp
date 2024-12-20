from .schemas import Employee, EmployeeSchema
from ninja import Router

employee_router = Router()

@employee_router.get("", response=list[EmployeeSchema], url_name='get_all_employees')
def get_employees(request):
    return Employee.objects.all()

@employee_router.post("", response=EmployeeSchema, url_name='create_employee')
def create_employee(request, employee: EmployeeSchema):
    return Employee.objects.create(**employee.dict())
