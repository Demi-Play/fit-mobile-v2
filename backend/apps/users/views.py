from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Goal
from .serializers import UserSerializer, GoalSerializer

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class GoalViewSet(viewsets.ModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
