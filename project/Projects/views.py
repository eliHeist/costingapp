from datetime import date
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.views import View

from finance.LabourCostings.models import ItemType, LabourTable
from people.Customers.models import Customer
from project.Projects.models import Project
from project.Projects.forms import ProjectModelForm


class ProjectsView(View):
    def get(self, request):
        projects = Project.objects.filter(is_active=True).order_by('-created_at')
        customers = Customer.objects.all()
        context = {
            'projects': projects,
            'customers': customers,
        }
        return render(request, "Projects/projects_page.html", context)

    def post(self, request):
        print(request.POST)
        # Manually create the project from the POST data
        cost = request.POST.get('cost_to_customer')
        if cost:
            cost = int(cost)
        else:
            cost = None
            
        project_data = {
            'title': request.POST.get('name'),
            'description': request.POST.get('description'),
            'customer_id': request.POST.get('customer'),
            'cost_to_customer': cost
        }
        try:
            project = Project.objects.create(**project_data)
            print("Project created successfully.")
            messages.success(request, "Project created successfully.")
            return render(request, "Projects/projects_page.html#project", {"project": project})
        except Exception as e:
            print(e)
            return HttpResponse("")


class ProjectDetailView(View):
    def get(self, request, pk):
        project = Project.objects.get(pk=pk)
        customers = Customer.objects.all()
        context = {
            'project': project,
            'customers': customers,
        }
        return render(request, "Projects/project/landing.html", context)


class ProjectParticularsView(View):
    def get(self, request, pk):
        today = date.today()
        project = Project.objects.get(pk=pk)
        customers = Customer.objects.all()
        types = ItemType.objects.all()
        labour_table = LabourTable.objects.all().prefetch_related('item_costings').filter(effective_end_date__gte=today).filter(effective_start_date__lte=today)
        context = {
            'project': project,
            'customers': customers,
            'types': types,
            'table': labour_table,
        }
        return render(request, "Projects/project/particulars.html", context)


class ProjectsFormView(View):
    def get(self, request, pk=None):
        project = None
        if pk:
            project = Project.objects.get(pk=pk)
        
        form = ProjectModelForm(instance=project)
        
        context = {
            'form': form,
            'project': project
        }
        
        return render(request, "Projects/project_form.html", context)
    
    def post(self, request, pk=None):
        project = None
        if pk:
            project = Project.objects.get(pk=pk)
            
        form = ProjectModelForm(request.POST, instance=project)
        
        if form.is_valid():
            project = form.save()
            messages.success(request, "Project saved successfully.")
            return redirect('Projects:detail', kwargs={"pk":project})
        else:
            context = {
                'form': form,
                'project': project
            }
            return render(request, "Projects/project_form.html", context)
        