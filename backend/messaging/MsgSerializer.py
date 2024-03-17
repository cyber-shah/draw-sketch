from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, Serializer
from .models import Message


class MsgSerializer(ModelSerializer):
    sender = serializers.CharField()
    space = serializers.CharField()
    timestamp = serializers.DateTimeField(read_only=True)
    payload = serializers.CharField()

    class Meta:
       model = Message
       fields=['sender', 'space', 'timestamp', 'payload']

    def create(self, validated_data):
        return super().create(validated_data)
