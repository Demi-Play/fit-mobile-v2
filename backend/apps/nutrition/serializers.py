from rest_framework import serializers
from .models import Nutrition

class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        exclude = ('user',)  # Исключаем поле user из сериализатора 