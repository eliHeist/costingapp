from pathlib import Path
from django.core.management.utils import get_random_secret_key
import os, environ

env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY') if DEBUG else get_random_secret_key()
# get list of the urls
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')
# INTERNAL_IPS = env.list('INTERNAL_IPS')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # installed packages
    'allauth',
    'allauth.account',
    # 'storages',
    'crispy_forms',
    'crispy_tailwind',
    'django_htmx',
    "template_partials",
    'django_cotton',

    # my created apps
    'api',
    
    'people.Users',
    'people.Employees',
    'people.Customers',

    'project.Projects',
    'project.Materials',
    'project.Quotations',

    'finance.Expenses',
    'finance.LabourCostings',
    'finance.Overheads',
]

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]

# django cleanup should be last
INSTALLED_APPS.append('django_cleanup.apps.CleanupConfig')

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    # 'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'django_htmx.middleware.HtmxMiddleware',

    # Add the account middleware:
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = 'psenec.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR/'psenec/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # `allauth` needs this from django
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'psenec.wsgi.application'

# production and dev database setup
DATABASES = {
    'default': {
        'ENGINE': os.getenv("DB_ENGINE"),
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        # 'PORT': os.getenv("DB_PORT"),
        # uncomment below for mysql
        "OPTIONS": {
            
        }
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Kampala'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'psenec/static/public'),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'psenec/static/staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')

APP_ROOT = os.path.join(BASE_DIR, env('APP_ROOT'))

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'django_errors.log',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# cors
# CORS_ALLOW_ALL_ORIGINS = True

# crispy forms
CRISPY_ALLOWED_TEMPLATE_PACKS = "tailwind"
CRISPY_TEMPLATE_PACK = "tailwind"

# email
EMAIL_BACKEND = env('EMAIL_BACKEND')
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_USE_TLS = env('EMAIL_USE_TLS')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
TO_EMAILS = env.list('TO_EMAILS')
# end email

# CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')
CORS_ALLOW_ALL_ORIGINS = True

# auth config
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
AUTH_USER_MODEL = 'Users.User'

SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = False
SESSION_COOKIE_AGE = 24 * 60 * 60

# azure blob setup
# if not DEBUG:
#     STORAGES = {
#         "default": {
#             "BACKEND": "storages.backends.azure_storage.AzureStorage",
#             "OPTIONS": {
#                 "connection_string": env("AZURE_CONNECTION_STRING"),
#                 "account_name": env("AZURE_ACCOUNT_NAME"),
#                 "account_key": env("AZURE_ACCOUNT_KEY"),
#                 "azure_container": env("AZURE_MEDIA_CONTAINER"),
#                 "expiration_secs": int(env("AZURE_URL_EXPIRATION_SECS")),
#             },
#         },
#         "staticfiles": {
#             "BACKEND": "storages.backends.azure_storage.AzureStorage",
#             "OPTIONS": {
#                 "connection_string": env("AZURE_CONNECTION_STRING"),
#                 "account_name": env("AZURE_ACCOUNT_NAME"),
#                 "account_key": env("AZURE_ACCOUNT_KEY"),
#                 "azure_container": env("AZURE_STATIC_CONTAINER"),
#             },
#         }
#     }

