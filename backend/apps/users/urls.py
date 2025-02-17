from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, GoalViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'goals', GoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls)),
] 