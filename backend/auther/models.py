from django.db import models

# Create your models here.


class User:
    user_name = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=200)
    created_date = models.DateField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.user_name)

