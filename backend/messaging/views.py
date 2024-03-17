from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .MsgSerializer import MsgSerializer
from .models import Message

# Create your views here.

@api_view(['POST'])
def create_message(request):
    serialized_msg = MsgSerializer(data=request.data)
    # TODO: also must be coming from a user that is authenticated
    # 2. IN a space that is valid
    if serialized_msg.is_valid():
        serialized_msg.save()
        return Response({'suceess': 'message added to the database'}, status.HTTP_202_ACCEPTED)
    else:
        return Response(serialized_msg.errors, status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_messages(request):
    messages = Message.objects.all()
    serialized_msg = MsgSerializer(messages, many=True)
    print(serialized_msg)
    return Response(serialized_msg.data, status.HTTP_200_OK)
