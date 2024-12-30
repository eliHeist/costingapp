from ninja import ModelSchema
from .models import Customer

class CustomerSchema(ModelSchema):
    class Meta:
        model = Customer
        fields = ('id', 'name', 'contact', 'contact_2')