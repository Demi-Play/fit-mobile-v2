from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    GoalViewSet, 
    RegisterView, 
    LoginView, 
    LogoutView,
    UserProfileView, 
    UserView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'goals', GoalViewSet, basename='goal')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('me/', UserView.as_view(), name='user-detail'),
] 