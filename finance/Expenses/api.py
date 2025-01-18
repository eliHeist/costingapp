from .schemas import ExpenseCategory, ExpenseCategorySchema
from ninja import Router

expense_router = Router()

@expense_router.get("categories/", response=list[ExpenseCategorySchema], url_name='get_all_expense_categories')
def get_expense_categories(request):
    return ExpenseCategory.objects.all()


@expense_router.post("categories/", response=ExpenseCategorySchema, url_name='create_expense_category')
def create_expense_category(request, expense_category: ExpenseCategorySchema):
    return ExpenseCategory.objects.create(**expense_category.dict())


@expense_router.get("categories/{expense_category_id}", response=ExpenseCategorySchema, url_name='get_expense_category')
def get_expense_category(request, expense_category_id: int):
    try:
        expense_category = ExpenseCategory.objects.get(id=expense_category_id)
        return expense_category
    except ExpenseCategory.DoesNotExist:
        return {"error": "ExpenseCategory not found"}, 404


@expense_router.put("categories/{expense_category_id}", response=ExpenseCategorySchema, url_name='update_expense_category')
def update_expense_category(request, expense_category_id: int, expense_category: ExpenseCategorySchema):
    try:
        existing_expense_category = ExpenseCategory.objects.get(id=expense_category_id)
        for key, value in expense_category.dict().items():
            setattr(existing_expense_category, key, value)
        existing_expense_category.save()
        return existing_expense_category
    except ExpenseCategory.DoesNotExist:
        return {"error": "ExpenseCategory not found"}, 404


@expense_router.delete("categories/{expense_category_id}", response=dict, url_name='delete_expense_category')
def delete_expense_category(request, expense_category_id: int):
    try:
        expense_category = ExpenseCategory.objects.get(id=expense_category_id)
        expense_category.delete()
        return {"message": "ExpenseCategory deleted successfully"}
    except ExpenseCategory.DoesNotExist:
        return {"error": "ExpenseCategory not found"}, 404


