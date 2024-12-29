from django.contrib import messages
from django.shortcuts import redirect, render
from django.views import View

from project.Projects.models import Project
from project.Projects.forms import ProjectModelForm


class ProjectsView(View):
    def get(self, request):
        projects = Project.objects.filter(is_active=True)
        context = {
            'projects': projects
        }
        return render(request, "Projects/projects_page.html", context)


class ProjectDetailView(View):
    def get(self, request, pk):
        project = Project.objects.get(pk=pk)
        context = {
            'project': project
        }
        return render(request, "Projects/project_detail_page.html", context)


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
        