from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Nutrition
from .serializers import NutritionSerializer
from django.utils import timezone
from django.db.models import Sum
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class NutritionViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Nutrition.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.user == self.request.user:
            serializer.save()
        else:
            raise PermissionError("You don't have permission to edit this nutrition record")

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

    @action(detail=False, methods=['get'])
    def today_stats(self, request):
        """Получить статистику питания за сегодня"""
        try:
            today = timezone.now().date()
            stats = self.get_queryset().filter(created_at__date=today).aggregate(
                total_calories=Sum('calories'),
                total_protein=Sum('protein'),
                total_carbohydrates=Sum('carbohydrates'),
                total_fats=Sum('fats')
            )
            
            # Преобразуем None в 0 для всех значений
            stats = {k: v or 0 for k, v in stats.items()}
            
            logger.info(f"Today's nutrition stats for user {request.user.username}: {stats}")
            
            return Response(stats)
        except Exception as e:
            logger.error(f"Error getting today's nutrition stats: {e}")
            return Response(
                {'error': 'Failed to get nutrition statistics'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
