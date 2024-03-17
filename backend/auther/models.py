from typing import Any
from django.db import models
# Create your models here.


class User(models.Model):
    user_name = models.CharField(max_length=100, unique=True)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=200)
    created_date = models.DateTimeField(auto_now_add=True)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        return str(self.user_name)

