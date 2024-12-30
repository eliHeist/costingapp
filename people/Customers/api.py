from .schemas import Customer, CustomerSchema
from ninja import Router

customer_router = Router()

@customer_router.get("", response=list[CustomerSchema], url_name='get_all_customers')
def get_customers(request):
    return Customer.objects.all()


@customer_router.post("", response=CustomerSchema, url_name='create_customer')
def create_customer(request, customer: CustomerSchema):
    return Customer.objects.create(**customer.dict())


@customer_router.get("/{customer_id}", response=CustomerSchema, url_name='get_customer')
def get_customer(request, customer_id: int):
    try:
        customer = Customer.objects.get(id=customer_id)
        return customer
    except Customer.DoesNotExist:
        return {"error": "Customer not found"}, 404


@customer_router.put("/{customer_id}", response=CustomerSchema, url_name='update_customer')
def update_customer(request, customer_id: int, customer: CustomerSchema):
    try:
        existing_customer = Customer.objects.get(id=customer_id)
        for key, value in customer.dict().items():
            setattr(existing_customer, key, value)
        existing_customer.save()
        return existing_customer
    except Customer.DoesNotExist:
        return {"error": "Customer not found"}, 404


@customer_router.delete("/{customer_id}", response=dict, url_name='delete_customer')
def delete_customer(request, customer_id: int):
    try:
        customer = Customer.objects.get(id=customer_id)
        customer.delete()
        return {"message": "Customer deleted successfully"}
    except Customer.DoesNotExist:
        return {"error": "Customer not found"}, 404


