from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Goal
from .serializers import (
    UserSerializer, 
    GoalSerializer, 
    UserProfileSerializer,
    ChangePasswordSerializer
)
from rest_framework.views import APIView
import logging
from django.views.generic import TemplateView
from django.conf import settings
import os

User = get_user_model()
logger = logging.getLogger(__name__)

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action in ['register']:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'put'])
    def profile(self, request):
        """Get or update user profile"""
        if request.method == 'GET':
            serializer = UserProfileSerializer(request.user)
            logger.info(f"Getting profile for user {request.user.username}")
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
            logger.info(f"Updating profile for user {request.user.username} with data: {request.data}")
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Profile updated successfully for user {request.user.username}")
                return Response(serializer.data)
            logger.error(f"Profile update failed for user {request.user.username}: {serializer.errors}")
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data['old_password']):
                user.set_password(serializer.data['new_password'])
                user.save()
                return Response({'message': 'Password changed successfully'})
            return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        logger.info(f"Getting goals for user {self.request.user.username}")
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        logger.info(f"Creating goal for user {self.request.user.username}")
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        logger.info(f"Updating goal for user {self.request.user.username}")
        instance = self.get_object()
        if instance.user == self.request.user:
            serializer.save()
        else:
            raise PermissionError("You don't have permission to edit this goal")

    def destroy(self, request, *args, **kwargs):
        logger.info(f"Deleting goal for user {request.user.username}")
        instance = self.get_object()
        if instance.user != request.user:
            raise PermissionError("You don't have permission to delete this goal")
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def toggle_achieved(self, request, pk=None):
        """Переключить статус достижения цели"""
        goal = self.get_object()
        goal.achieved = not goal.achieved
        goal.save()
        serializer = self.get_serializer(goal)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_progress(self, request, pk=None):
        """Обновить прогресс цели"""
        goal = self.get_object()
        progress = request.data.get('progress')
        if progress is None:
            return Response(
                {'error': 'Progress value is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            progress = float(progress)
            if not 0 <= progress <= 100:
                raise ValueError("Progress must be between 0 and 100")
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        goal.progress = progress
        if progress == 100:
            goal.achieved = True
        goal.save()
        
        serializer = self.get_serializer(goal)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Получить цели по категории"""
        category = request.query_params.get('category')
        if not category:
            return Response(
                {'error': 'Category parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        goals = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(goals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def achieved(self, request):
        """Получить достигнутые цели"""
        goals = self.get_queryset().filter(achieved=True)
        serializer = self.get_serializer(goals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def in_progress(self, request):
        """Получить цели в процессе"""
        goals = self.get_queryset().filter(achieved=False)
        serializer = self.get_serializer(goals, many=True)
        return Response(serializer.data)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'detail': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        user = authenticate(username=username, password=password)
        
        if user:
            # Очищаем все предыдущие токены пользователя
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
                OutstandingToken.objects.filter(user=user).delete()
                logger.info(f"Cleared previous sessions for user {username}")
            except Exception as e:
                logger.error(f"Error clearing previous sessions: {e}")

            # Создаем новый токен
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
            
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Выход пользователя из системы"""
        try:
            # Получаем токен из заголовка
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return Response(
                    {'error': 'Invalid authorization header'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Извлекаем токен
            token = auth_header.split(' ')[1]
            
            # Добавляем токен в черный список
            token_obj = RefreshToken(token)
            token_obj.blacklist()
            
            logger.info(f"User {request.user.username} logged out successfully")
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Logout error: {e}")
            return Response(
                {'error': 'Failed to logout'},
                status=status.HTTP_400_BAD_REQUEST
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
        
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LandingPageView(TemplateView):
    template_name = 'landing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Путь к APK файлу
        apk_path = os.path.join(settings.MEDIA_ROOT, 'apk', 'fit-mobile.apk')
        context['apk_exists'] = os.path.exists(apk_path)
        context['apk_url'] = settings.MEDIA_URL + 'apk/fit-mobile.apk' if context['apk_exists'] else None
        return context
