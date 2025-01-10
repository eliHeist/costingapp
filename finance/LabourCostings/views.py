from django.http import QueryDict
from django.shortcuts import get_object_or_404, render, redirect
from django.urls import reverse
from django.views import View
from finance.LabourCostings.models import ItemType, LabourTable, ItemCosting

from datetime import date


class LaborFeesView(View):
    def get(self, request):
        
        data = self.get_template()
        
        return render(request, data.get('template_name'), data.get('context'))
    
    def get_template(self):
        today = date.today()
        labor_fees = LabourTable.objects.all().prefetch_related('item_costings').filter(effective_end_date__gte=today).filter(effective_start_date__lte=today)

        context = {
            "labor_fees": labor_fees,
        }
        template_name = "LabourCostings/labor-table.html"
        
        return {
            "context": context,
            "template_name": template_name
        }
        
        
class LaborFeesEditView(View):
    def get(self, request, pk):
        table = get_object_or_404(LabourTable.objects.prefetch_related('item_costings'), id=pk)
        types = ItemType.objects.all()
        context = {
            "table": table,
            "types": types,
        }
        template_name = "LabourCostings/labor-table-form.html"

        return render(request, template_name, context)
    
    def post(self, request, pk):

        data = request.POST
        table = get_object_or_404(LabourTable, id=pk)

        # print(data)

        # if there is no id create a new item costing otherwise update the exixting one
        if data.get("id") == "":
            item = ItemCosting(
                name=data.get("name"),
                type=ItemType.objects.get(id=data.get("type")),
                code=data.get("code"),
                unit_name=data.get("unit_name"),
                fabrication_cost=float(data.get("fabrication_cost", '0').replace(',', '')),
                spraying_cost=float(data.get("spraying_cost", '0').replace(',', '')),
                costing_method=data.get("costing_method"),
                min_height=data.get("min_height", None),
                min_length=data.get("min_length", None),
                max_height=data.get("max_height", None),
                max_length=data.get("max_length", None),
                table=table
            ).save()
        else:
            item = ItemCosting.objects.get(id=data.get("id"))
            item.name = data.get("name")
            item.type = ItemType.objects.get(id=data.get("type"))
            item.code = data.get("code")
            item.unit_name = data.get("unit_name")
            item.fabrication_cost = float(data.get("fabrication_cost", '0').replace(',', ''))
            item.spraying_cost = float(data.get("spraying_cost", '0').replace(',', ''))
            item.costing_method = data.get("costing_method")
            item.min_height = data.get("min_height", None)
            item.min_length = data.get("min_length", None)
            item.max_height = data.get("max_height", None)
            item.max_length = data.get("max_length", None)
            item.save()
        
        if request.htmx:
            template_name = 'cotton/psenec/labour_itemrow.html'
            types = ItemType.objects.all()
            context = {
                "item": item,
                "table": table,
                "types": types,
            }
            response = render(request, template_name, context)
            response['HX-Refresh'] = True
            return response
            
        return redirect(reverse("LabourCostings:labor-table-edit", kwargs={"pk": pk}))
    
    
    def put(self, request, pk):
        print('\n\nPUT\n')
        data = QueryDict(request.body.decode('utf-8'))
        print(data)
        table = get_object_or_404(LabourTable, id=pk)
        # data looks like this <QueryDict: {'csrfmiddlewaretoken': ['udD5RpwbJJ3GGyTk1rg5GfdsxHIZQfeDuLCShFxaphnAfsxcP7qltBX3ruexwIMI'], 'id': [''], 'table_id': ['1'], 'name': ['SMALL WINDOW'], 'type': ['2'], 'code': ['B'], 'unit_name': ['m'], 'fabrication_cost': ['13,000'], 'spraying_cost': ['6,000'], 'costing_method': ['BM'], 'min_height': ['0.9'], 'min_length': ['0.9'], 'max_height': ['1.2'], 'max_length': ['1.2']}>
        if not table:
            return

        item = ItemCosting.objects.get(id=data.get("id"))
        item.name = data.get("name")
        item.type = ItemType.objects.get(id=data.get("type"))
        item.code = data.get("code")
        item.unit_name = data.get("unit_name")
        item.fabrication_cost = float(data.get("fabrication_cost", '0').replace(',', ''))
        item.spraying_cost = float(data.get("spraying_cost", '0').replace(',', ''))
        item.costing_method = data.get("costing_method")
        item.min_height = data.get("min_height", None)
        item.min_length = data.get("min_length", None)
        item.max_height = data.get("max_height", None)
        item.max_length = data.get("max_length", None)
        item.save()
        
        if request.htmx:
            template_name = 'cotton/psenec/labour_itemrow.html'
            types = ItemType.objects.all()
            context = {
                "item": item,
                "table": table,
                "types": types,
            }
            return render(request, template_name, context)
            
        return redirect(reverse("LabourCostings:labor-table-edit", kwargs={"pk": pk}))
    

class LaborFeesCreateView(View):
    def post(self, request):
        data = request.POST
        print(data)
        effective_start_date_str = data.get("effective_start_date")
        effective_end_date_str = data.get("effective_end_date")

        effective_start_date = date.fromisoformat(effective_start_date_str)
        effective_end_date = date.fromisoformat(effective_end_date_str)

        if effective_start_date > effective_end_date:
            errors = ["Invalid date range. The start date must be before the end date."]
        elif LabourTable.objects.filter(effective_start_date__lte=effective_end_date, effective_end_date__gte=effective_start_date).exists():
            errors = ["A labor table already exists in this duration."]
        else:
            labour_table = LabourTable(effective_start_date=effective_start_date, effective_end_date=effective_end_date)
            labour_table.save()
            return redirect(reverse("LabourCostings:labor-table-edit", kwargs={"pk": labour_table.id}))
        
        # return labor table view
        data = LaborFeesView.get_template()
        data.context["errors"] = errors
        
        return render(request, data.get('template_name'), data.get('context'))
        
        
