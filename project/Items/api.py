from ninja import Router
from .models import Item, ItemGroup
from .schemas import ItemSchema, ItemGroupSchema

items_router = Router()


@items_router.post('item_groups/', response=ItemGroupSchema, url_name='create_item_group')
def create_item_group(request, item_group: ItemGroupSchema):
    return ItemGroup.objects.create(**item_group.dict())

@items_router.put('item_groups/', response=ItemGroupSchema, url_name='update_item_group')
def update_item_group(request, item_group: ItemGroupSchema):
    return ItemGroup.objects.filter(id=item_group.id).update(**item_group.dict())

@items_router.get('item_groups/', response=list[ItemGroupSchema], url_name='get_all_item_groups')
def get_item_groups(request):
    return ItemGroup.objects.all()

@items_router.get('item_groups/{id}/', response=ItemGroupSchema, url_name='get_item_group')
def get_item_group(request, id):
    return ItemGroup.objects.get(id=id)


@items_router.post('items/', response=ItemSchema, url_name='create_item')
def create_item(request, item: ItemSchema):
    return Item.objects.create(**item.dict())

@items_router.put('items/', response=ItemSchema, url_name='update_item')
def update_item(request, item: ItemSchema):
    return Item.objects.filter(id=item.id).update(**item.dict())

@items_router.get('items/', response=list[ItemSchema], url_name='get_all_items')
def get_items(request):
    return Item.objects.all()

@items_router.get('items/{id}/', response=ItemSchema, url_name='get_item')
def get_item(request, id):
    return Item.objects.get(id=id)
