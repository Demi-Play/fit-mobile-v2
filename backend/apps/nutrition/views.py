from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Nutrition
from .serializers import NutritionSerializer

# Create your views here.

class NutritionViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Nutrition.objects.none()  # Пустой queryset по умолчанию

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Nutrition.objects.filter(user=self.request.user)
        return Nutrition.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """Удалить все записи о питании пользователя"""
        nutrition = self.get_queryset()
        nutrition.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'])
    def delete_by_date(self, request):
        """Удалить записи о питании за определенную дату"""
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'Date parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        nutrition = self.get_queryset().filter(created_at__date=date)
        nutrition.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'])
    def delete_by_meal_type(self, request):
        """Удалить записи о питании по типу приема пищи"""
        meal_type = request.query_params.get('meal_type')
        if not meal_type:
            return Response(
                {'error': 'Meal type parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        nutrition = self.get_queryset().filter(meal_type=meal_type)
        nutrition.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
