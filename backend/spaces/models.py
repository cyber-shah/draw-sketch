from django.db import models
from auther.models import User
# Create your models here.


class Spaces(models.Model):
    name = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING)
