from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, GoalViewSet, RegisterView, LoginView, UserProfileView, UserView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'goals', GoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserView.as_view(), name='user'),
] 