from typing import Any
from .serializers import MyTokenObtainPairSerializer, WineSerializer, CountrySerializer, WineColorSerializer, WineTasteSerializer, UserRegisterSerializer, UserProfileSerializer, ChangePasswordSerializer, ChangeUsernameSerializer, OrderSerializer, UserRoleSerializer, FavoriteWineSerializer, FavoriteWinesSerializer, ReviewSerializer
from .permissions import IsManagerOrReadOnly, ProfilePermission, OrderPermission, OrderDetailsPermission, IsManager, ReviewPermission
from base.models import Wine, Country, WineColor, WineTaste, User, Order, OrderDetails, Review

from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import viewsets, permissions, mixins, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.views import APIView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class WineViewSet(viewsets.ModelViewSet):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer
    permission_classes = (IsManagerOrReadOnly, )

    @action(detail=True, methods=['put'], serializer_class=FavoriteWineSerializer, permission_classes=[IsAuthenticated,])
    def add_to_favorites(self, request, pk=None):
        user = request.user
        user.favorite_wines.add(self.get_object())
        
        response = {
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Successfully added wine to favorites.',
            'data': []
        }

        return Response(response)
    
    @action(detail=True, methods=['put'], serializer_class=FavoriteWineSerializer, permission_classes=[IsAuthenticated,])
    def remove_from_favorites(self, request, pk=None):
        user = request.user
        user.favorite_wines.remove(self.get_object())
        
        response = {
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Successfully removed wine from favorites.',
            'data': []
        }

        return Response(response)

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = (IsManagerOrReadOnly, )

class WineColorViewSet(viewsets.ModelViewSet):
    queryset = WineColor.objects.all()
    serializer_class = WineColorSerializer
    permission_classes = (IsManagerOrReadOnly, )

class WineTasteViewSet(viewsets.ModelViewSet):
    queryset = WineTaste.objects.all()
    serializer_class = WineTasteSerializer
    permission_classes = (IsManagerOrReadOnly, )

class UserRegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = (AllowAny, )

class UserProfileViewSet(mixins.RetrieveModelMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (ProfilePermission, )

    def perform_destroy(self, instance):
        deleted_user = User.objects.get(username="deleted")

        # Set all orders of this user to <deleted> user
        for order in Order.objects.filter(user=instance):
            order.user = deleted_user
            order.save()
        
        # Set all reviews of this user to <deleted> user
        for review in Review.objects.filter(user=instance):
            review.user = deleted_user
            review.save()
        
        # Delete the user
        instance.delete()

    @action(detail=True, methods=['put'], serializer_class=ChangePasswordSerializer)
    def change_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data.get("new_password"))
            user.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], serializer_class=ChangeUsernameSerializer)
    def change_username(self, request, pk=None):
        user = self.get_object()
        serializer = ChangeUsernameSerializer(data=request.data)

        if serializer.is_valid():
            user.username = serializer.data.get("username")
            user.save()

            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Username updated successfully',
                'data': []
            }

            return Response(response)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], serializer_class=UserRoleSerializer, permission_classes=[IsManager,])
    def set_role(self, request, pk=None):
        user = self.get_object()
        serializer = UserRoleSerializer(data=request.data)

        if serializer.is_valid():
            user.role = serializer.data.get("role")
            user.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Role changed successfully',
                'data': []
            }

            return Response(response)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'], serializer_class=FavoriteWinesSerializer, permission_classes=[IsAuthenticated,])
    def favorites(self, request, pk=None):
        user = request.user
        serializer = FavoriteWinesSerializer(User.objects.filter(pk=user.pk), many=True)
        return Response(serializer.data[0])

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and not self.request.user.is_superuser:
            qs = qs.filter(pk=self.request.user.pk)
        return qs
    
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (OrderPermission, )

    def perform_destroy(self, instance):
        for order_detail in OrderDetails.objects.filter(order=instance):
            wine = order_detail.wine
            quantity = order_detail.quantity

            wine.units_in_stock += quantity
            wine.save()
            order_detail.delete()
        instance.delete()

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list":
            qs = qs.filter(user=self.request.user)
        return qs

class ReviewViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (ReviewPermission, )

    def get_queryset(self):
        self.wine = Wine.objects.get(pk=self.kwargs['wine_id'])
        return Review.objects.filter(wine=self.wine)

    def perform_create(self, serializer):
        self.wine = Wine.objects.get(pk=self.kwargs['wine_id'])
        serializer.save(wine=self.wine, user=self.request.user)

class AlcoholValuesView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        alcohol_values = set([wine.alcohol for wine in Wine.objects.all()])
        return Response(alcohol_values)
    
class VolumeValuesView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        volume_values = set([wine.volume for wine in Wine.objects.all()])
        return Response(volume_values)

class YearValuesView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        year_values = set([wine.year for wine in Wine.objects.all()])
        return Response(year_values)