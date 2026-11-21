from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = (request.data.get('username') or request.data.get('login') or '').strip()
        password = (request.data.get('password') or request.data.get('pass') or '').strip()

        if not username or not password:
            return Response(
                {'error': 'Login va parol kiritilishi shart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {'error': 'Login yoki parol noto‘g‘ri'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_staff:
            return Response(
                {'error': 'Ushbu foydalanuvchida admin huquqlari mavjud emas'},
                status=status.HTTP_403_FORBIDDEN
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'success': True,
            'token': token.key,
            'username': user.username,
            'is_staff': user.is_staff,
            'message': 'Boshqaruv paneliga muvaffaqiyatli kirildi'
        })


class AdminVerifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'valid': True,
            'username': request.user.username,
            'is_staff': request.user.is_staff
        })


class AdminLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            Token.objects.filter(user=request.user).delete()
        except Exception:
            pass
        return Response({'success': True, 'message': 'Tizimdan muvaffaqiyatli chiqildi'})
