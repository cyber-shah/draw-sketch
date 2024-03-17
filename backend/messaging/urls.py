from django import urls
from django.urls import path

from .views import create_message, get_messages

urlpatterns = [
    path('create/', create_message, name='create'),
    path('get/', get_messages, name='get'),
]


