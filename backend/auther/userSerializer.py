from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField()
    # read only means that clients cannot specify any value here
    created_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model= User
        fields = ['user_name', 'email', 'password', 'created_date']

    def create(self, validated_data):
        return super().create(validated_data)
