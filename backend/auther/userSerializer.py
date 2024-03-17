from rest_framework import serializers

from .models import User

class UserSerializer(serializers.ModelSerializer):
    # NOTE: attributes are for validation and fields meta is to include or remove
    user_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField()
    # read only means that clients cannot specify any value here
    created_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model= User
        #  fields attribute in the serializer's Meta class affects only the serialization 
        #  and deserialization behavior of the serializer, not the underlying database schema.
        fields = ['user_name', 'email', 'password', 'created_date']

    def create(self, validated_data):
        return super().create(validated_data)
