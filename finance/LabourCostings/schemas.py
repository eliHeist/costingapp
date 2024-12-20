from ninja import ModelSchema
from .models import ItemType, LabourTable, ItemCosting

class ItemTypeSchema(ModelSchema):
    class Meta:
        model = ItemType
        fields = '__all__'

class LabourTableSchema(ModelSchema):
    class Meta:
        model = LabourTable
        fields = '__all__'