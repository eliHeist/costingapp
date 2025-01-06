from ninja import ModelSchema
from .models import Item, ItemGroup

class ItemSchema(ModelSchema):
    class Meta:
        model = Item
        fields = '__all__'

class ItemGroupSchema(ModelSchema):
    class Meta:
        model = ItemGroup
        fields = '__all__'
