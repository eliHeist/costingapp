from django.shortcuts import render
from django.views import View

# Create your views here.
class LandingView(View):
    context = {}
    template_name = 'Frontend/landing.html'
    def get(self, request):
        return render(request, self.template_name, self.context)