from typing import Any
from django.contrib.auth import get_user_model
from django.contrib.auth import forms as auth_forms
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse_lazy
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django import forms
from django.contrib.sites.shortcuts import get_current_site
from django.template import loader
from django.utils.html import strip_tags
from django.core.mail import send_mail

from assetbank import widgets
from technicians.models import Technician 


User = get_user_model()

class SignupForm(auth_forms.UserCreationForm):
    class Meta:
        model = User
        fields = ("first_name","last_name","username","email")
        field_classes = {'username': auth_forms.UsernameField}

class UserCreateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("first_name","last_name","username","email","phone_1","phone_2","profile_picture","is_active", "is_technician", "is_account_staff")
        # exclude = ("password",)
        widgets = {
            "first_name": widgets.TextInput(),
            "last_name": widgets.TextInput(),
            "username": widgets.TextInput(icon='fas fa-user'),
            "email": widgets.EmailInput(),
            "phone_1": widgets.PhoneInput(),
            "phone_2": widgets.PhoneInput(),
            "profile_picture": widgets.ImageInput(),
        }
    
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.request = kwargs.pop('request', None)
        super().__init__(*args, **kwargs)
    
    def save(self, commit: bool = True):
        user = super().save(commit=False)
        new_user = False
        if not user.pk:
            password = get_random_string(length=32)
            user.set_password(password)
            new_user = True

        if commit:
            user.save()
            
            if new_user:
                # create password reset link
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                reset_url = reverse_lazy('accounts:password_reset_confirm', kwargs={'uidb64':uid,'token':token})
                
                current_site = get_current_site(self.request)
                site_name = current_site.name
                domain = current_site.domain
                
                # drop
                context = {
                    "email": user.email,
                    "domain": domain,
                    "site_name": site_name,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "user": user,
                    "token": token,
                    "protocol": "https",
                    "message": "Activate your account"
                }
                
                self.send_mail(context, user.email)
        return user
    
    def send_mail(self, context, email):
        # Email subject *must not* contain newlines
        subject = "Activate Your Account"
        email_html_message = loader.render_to_string('registration/password_reset_email.html', context)
        email_plain_message = strip_tags(email_html_message)
        
        print('sending message')
        print(context['email'])
        print(context)
        # joseph website tours
        
        send_mail(
            subject, 
            email_plain_message, 
            f'MBF Auto <{settings.EMAIL_HOST_USER}>', 
            [email,], 
            fail_silently=False,
            html_message=email_html_message,
        )

class PasswordResetForm(auth_forms.PasswordResetForm):
    pass
