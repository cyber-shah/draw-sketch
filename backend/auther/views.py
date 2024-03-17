# Create your views here.


from django.http.response import HttpResponse


def register_user(request):
    return HttpResponse("User registered")

def login_user(request):
    return HttpResponse("Login works")
