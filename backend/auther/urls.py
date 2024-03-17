from django.urls import path

from .views import delete_user, register_user, login_user, get_users, update_user

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('all/', get_users, name='get_users'),
    path('delete/',delete_user, name='delete' ),
    path('update/', update_user, name='update')
]
