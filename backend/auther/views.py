# NOTE: this file handles the requests and dispactches 
# relevant functions based on them

# Create your views here.
# We mostly woik with the database here
# Models created an database object for us
# This part modifies the database based on the request.

from django.http.response import HttpResponse
from rest_framework.compat import apply_markdown
from rest_framework.exceptions import status
from rest_framework.schemas.coreapi import serializers
from .userSerializer import UserSerializer
from rest_framework import response
from rest_framework.decorators import api_view
from .models import User

@api_view(['POST'])
def register_user(request):
    serializers = UserSerializer(data=request.data)
    if serializers.is_valid():
        serializers.save()
        return response.Response(serializers.data, status.HTTP_201_CREATED)
    else:
        return response.Response(serializers.errors, status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def login_user(request):
    return HttpResponse("Login works")


@api_view(['GET'])
def get_users(request):
    users = User.objects.all()
    serializers = UserSerializer(users, many=True) 
    return response.Response(serializers.data)

@api_view(['DELETE'])
def delete_user(request):
    try:
        user = User.objects.get(pk=request.data.user_name)
    except:
        # NOTE :we just return a rest_framework response and then the frontend is responsible for picking
        # this up and rendering the HTML
        return response.Response({'error': 'User does not exist'},status = status.HTTP_400_BAD_REQUEST)
   
    # once we retrieve data from the database, it becomes a python object
    # we can make all the changes to the object and hit save to send it to the database
    # so all the work is done on python object, except for retreival
    user.delete()
    return response.Response({'success' : 'User deleted'}, status = status.HTTP_202_ACCEPTED)


@api_view(['PUT'])
def update_user(request):
    print(request)
    try:
        user = User.objects.get(user_name=request.data.get('user_name'))
    except:
        return response.Response({'error': 'User does not exist'},status = status.HTTP_400_BAD_REQUEST)

    # to update, we pass in the user, and then the data of that user to be updated
    # if we don't specify partial_update TRUE here, it will need all the fields and when it checks
    # if its valid, it will return false!
    serialzed_user = UserSerializer(user, data=request.data, partial=True)
    if serialzed_user.is_valid():
        serialzed_user.save()
        return response.Response({'success': 'User data updated'}, status = status.HTTP_202_ACCEPTED)
    else:
        return response.Response(status= status.HTTP_400_BAD_REQUEST)

    


