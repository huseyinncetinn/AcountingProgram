from rest_framework import permissions

class OwnProfileOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.user
    
class IsOwnerOrReadOnlySupplier(permissions.BasePermission):


    def has_object_permission(self, request, view, obj): 
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.toWho.user == request.user
    
class IsOwnerOrReadOnlyCustomer(permissions.BasePermission):

    def has_object_permission(self, request, view, obj): 
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.fromWho.user == request.user
    
class IsOwnerOrReadOnlyProduct(permissions.BasePermission):

    def has_object_permission(self, request, view, obj): 
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.user.user == request.user
