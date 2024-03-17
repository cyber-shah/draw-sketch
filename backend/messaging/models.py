from typing import Any
from django.db import models

# Create your models here.
class Message(models.Model):
    sender = models.CharField(max_length=100)
    space = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    payload = models.CharField(max_length=1000)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)

    def __str__(self) -> str:
        return super().__str__()
