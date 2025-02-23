from ninja import NinjaAPI

from finance.LabourCostings.api import table_router
from finance.Expenses.api import expense_router
from people.Employees.api import employee_router
from people.Customers.api import customer_router
from project.Items.api import items_router

api = NinjaAPI(urls_namespace='api')

api.add_router('/tables', table_router)
api.add_router('/employees', employee_router)
api.add_router('/customers', customer_router)
api.add_router('/items', items_router)
api.add_router('/expenses', expense_router)
