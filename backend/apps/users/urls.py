from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, GoalViewSet

router = DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'goals', GoalViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 