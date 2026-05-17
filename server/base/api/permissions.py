from rest_framework import permissions
from base.models import User

class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only the manager to create/update/delete objects.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_authenticated and request.user.role == User.SHOP_MANAGER

class IsManager(permissions.BasePermission):
    """
    Custom permission to allow only the manager to do everything.
    """

    def has_permission(self, request, view):        
        return request.user.is_authenticated and request.user.role == User.SHOP_MANAGER

class OrderPermission(permissions.BasePermission):
    """
    Custom permission to allow authenticated users to create orders. Updating/deleting can be done by a client that made an order or a manager.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return request.user.role == User.SHOP_MANAGER or obj.user == request.user
    
class OrderDetailsPermission(permissions.BasePermission):
    """
    Custom permission to allow only the client that made an order and a manager to modify order details.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return request.user.role == User.SHOP_MANAGER or obj.order.user == request.user

class ProfilePermission(permissions.BasePermission):
    """
    Custom permisstion to allow only the user to manage their own profile (and the superuser).
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return obj != User.objects.get(username="deleted") and (request.user.is_superuser or request.user == obj)
    

class ReviewPermission(permissions.BasePermission):    
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or request.user.role == User.SHOP_MANAGER or request.user == obj.user 