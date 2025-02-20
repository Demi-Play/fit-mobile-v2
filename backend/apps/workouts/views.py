from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Workout
from .serializers import WorkoutSerializer

# Create your views here.

class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.user == self.request.user:
            serializer.save()
        else:
            raise PermissionError("You don't have permission to edit this workout")

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """Удалить все тренировки пользователя"""
        workouts = self.get_queryset()
        workouts.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'])
    def delete_by_date(self, request):
        """Удалить тренировки за определенную дату"""
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'Date parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        workouts = self.get_queryset().filter(created_at__date=date)
        workouts.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
