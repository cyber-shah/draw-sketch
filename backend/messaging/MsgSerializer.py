from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from .models import Message


class MsgSerializer(ModelSerializer):
    sender = serializers.CharField(max_length=100)
    space = serializers.CharField(max_length = 100)
    timestamp = serializers.DateTimeField(read_only=True)
    payload = serializers.CharField(max_length=1000)

    class Meta:
       model = Message
       fields=['sender', 'space', 'timestamp', 'payload']

    def create(self, validated_data):
        return super().create(validated_data)
