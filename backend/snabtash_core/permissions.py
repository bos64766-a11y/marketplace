from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission: SAFE_METHODS (GET, HEAD, OPTIONS) are allowed for any request,
    while write operations (POST, PUT, PATCH, DELETE) require an authenticated staff user.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
