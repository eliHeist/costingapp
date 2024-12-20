from .schemas import ItemTypeSchema, LabourTableSchema
from .models import ItemType, LabourTable
from ninja import Router

table_router = Router()

@table_router.get('types/', response=list[ItemTypeSchema], url_name="get_all_types")
def get_types(request):
    return ItemType.objects.all()

@table_router.post('types/', response=ItemTypeSchema, url_name="create_type")
def create_type(request, item_type: ItemTypeSchema):
    return ItemType.objects.create(**item_type.dict())

# Labour Tables
@table_router.post('', response=LabourTableSchema, url_name='create_labour_table')
def create_labour_table(request, labour_table: LabourTableSchema):
    return LabourTable.objects.create(**labour_table.dict())

@table_router.put('', response=LabourTableSchema, url_name='update_labour_table')
def update_labour_table(request, labour_table: LabourTableSchema):
    return LabourTable.objects.filter(id=labour_table.id).update(**labour_table.dict())

@table_router.get('', response=list[LabourTableSchema], url_name='get_all_labour_tables')
def get_labour_tables(request):
    return LabourTable.objects.all()

@table_router.get('{id}/', response=LabourTableSchema, url_name='get_labour_table')
def get_labour_table(request, id):
    return LabourTable.objects.get(id=id)