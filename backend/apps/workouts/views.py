from django.shortcuts import render
from rest_framework import viewsets
from .models import Workout
from .serializers import WorkoutSerializer

# Create your views here.

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
