from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.urls import reverse, reverse_lazy
from django.shortcuts import redirect, render
from django.views import View
from django.views.generic import CreateView
from accounts.forms import SignupForm, UserCreateForm
from django.contrib.auth import views
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response

from jobcards.models import JobCard, Task 

from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from logs.models import Log

User = get_user_model()
# Auth and accounts
class SignupView(LoginRequiredMixin, CreateView):
    template_name = 'registration/signup.html'
    form_class = SignupForm

    def get_success_url(self):
        return reverse('accounts:login')
    
class UserListView(PermissionRequiredMixin, View):
    permission_required = "accounts.view_user"
    def get(self, request, *args, **kwargs):
        template_name = 'accounts/user-list.html'
        users = User.objects.filter(is_active=True)
        context = {
            'users': users
        }
        return render(request, template_name, context)

class UserCUView(PermissionRequiredMixin, View):
    permission_required = "accounts.add_user"
    def get(self, request, pk=None):
        template_name = 'accounts/user-CU.html'
        context = {}
        if pk:
            # update
            user = User.objects.get(pk=pk)
            form = UserCreateForm(instance=user)
            context['form'] = form
        else:
            # create
            form = UserCreateForm()
            context['form'] = form
            
        return render(request, template_name, context)
    
    def post(self, request, pk=None):
        template_name = 'accounts/user-CU.html'
        context = {}

        # print(request.POST)
        print(request.FILES)
        if pk:
            user = User.objects.get(pk=pk)
            form = UserCreateForm(request.POST, request.FILES, instance=user, request=request)
        else:
            form = UserCreateForm(request.POST, request.FILES, request=request)
            
        
        if form.is_valid():
            user = form.save()
            return redirect(reverse_lazy('accounts:list'))
        else:
            print(form.errors)
            context['form'] = form
            return render(request, template_name, context)

class UserProfileView(LoginRequiredMixin, View):
    def get(self, request):
        template_name = 'accounts/user-detail.html'
        user = request.user
        context = {
            'user': user,
        }

        wages = user.wages.all().order_by('-date')
        context['wages'] = wages
        
        return render(request, template_name, context)
        

class UserDetailView(LoginRequiredMixin, View):
    def get(self, request, pk=None):
        template_name = 'accounts/user-detail.html'
        if pk:
            user = User.objects.get(pk=pk)
        else:
            user = request.user

        context = {
            'user': user,
        }
        
        wages = user.wages.all().prefetch_related('jobcard').prefetch_related('jobcard__vehicle').order_by('-date')
        total_wages = sum([w.amount() for w in wages])
        context['wages'] = wages
        context['total_wages'] = total_wages

        return render(request, template_name, context)
        
class SetThemeAPIView(APIView):
    def get(self, request, theme):
        if int(theme) == 1:
            request.user.dark_theme = True
            request.user.save()
        elif int(theme) == 0:
            request.user.dark_theme = False
            request.user.save()

        return Response(
            {'message': f'Changed theme to {request.user.dark_theme}'}
        )

class LoginView(View):
    def get(self, request):
        return render(request, 'registration/login.html', {})
    def post(self, request):
        data = request.POST
        get_data = request.GET
        username = data.get('username').strip()
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            next_route = get_data.get('next')
            if next_route:
                return redirect(next_route)
            return redirect(settings.LOGIN_REDIRECT_URL)
        
        user_obj = User.objects.filter(username=username).exists()
        username_error = "Username does not exist."
        password_error = None

        if user_obj:
            username_error = None
            password_error = "Password is incorrect."

        context = {
            "username": username,
            "password": password,
            "username_error": username_error,
            "password_error": password_error,
        }
        return render(request, 'registration/login.html', context)

class LogoutView(views.LogoutView):
    pass

class PasswordResetView(views.PasswordResetView):
    success_url = reverse_lazy("accounts:password_reset_done")
    html_email_template_name = 'registration/password_reset_email.html'

class PasswordResetDoneView(views.PasswordResetDoneView):
    pass

class PasswordResetConfirmView(views.PasswordResetConfirmView):
    success_url = reverse_lazy("accounts:password_reset_complete")

class PasswordResetCompleteView(views.PasswordResetCompleteView):
    pass

class PasswordChangeView(views.PasswordChangeView):
    success_url = reverse_lazy("accounts:password_change_done")

class PasswordChangeDoneView(views.PasswordChangeDoneView):
    pass


# logs
@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    log = Log.objects.create(
                link=user.getUrl(),
                description=f'{user.username} logged in',
                flag='7',
            )
    
@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    log = Log.objects.create(
                link=user.getUrl(),
                description=f'{user.username} logged out',
                flag='7',
            )
    