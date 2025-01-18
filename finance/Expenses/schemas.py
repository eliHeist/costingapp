from ninja import ModelSchema
from .models import Expense, ExpenseCategory

class ExpenseCategorySchema(ModelSchema):
    class Meta:
        model = ExpenseCategory
        fields = ('id', 'name')