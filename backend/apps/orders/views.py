from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import RequestOrder, CustomerContact
from .serializers import RequestOrderSerializer, CustomerContactSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = RequestOrder.objects.all().prefetch_related('items__product')
    serializer_class = RequestOrderSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['list', 'retrieve'] and self.request.query_params.get('phone'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()
        params = self.request.query_params

        # Status filter
        status_param = params.get('status')
        if status_param and status_param != 'Hammasi':
            qs = qs.filter(status=status_param)

        # Search query (customer name, company, id, or phone)
        search = params.get('q') or params.get('search')
        if search:
            s = search.strip()
            qs = qs.filter(
                Q(id__icontains=s)
                | Q(customer_name__icontains=s)
                | Q(customer_phone__icontains=s)
                | Q(customer_company__icontains=s)
                | Q(customer_inn__icontains=s)
            )

        # Phone filter (for customer's personal history)
        phone = params.get('phone')
        if phone:
            digits = ''.join(filter(str.isdigit, phone))
            if len(digits) >= 9:
                qs = qs.filter(Q(customer_phone=phone) | Q(customer_phone__icontains=digits[-9:]))
            else:
                qs = qs.filter(customer_phone=phone)

        return qs

    @action(detail=True, methods=['patch', 'post'], url_path='status')
    def update_status(self, request, id=None):
        order = self.get_object()
        new_status = request.data.get('status')
        valid_statuses = [choice[0] for choice in RequestOrder.STATUS_CHOICES]
        if not new_status or new_status not in valid_statuses:
            return Response(
                {'error': f"Noto‘g‘ri status. Ruxsat etilgan statuslar: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save(update_fields=['status', 'updated_at'])
        return Response({
            'id': order.id,
            'status': order.status,
            'message': f"Zayavka #{order.id} holati '{new_status}' ga o‘zgartirildi"
        })


class CustomerLookupView(APIView):
    """
    Looks up previous customer details by phone number to auto-fill repeat orders
    """
    throttle_scope = 'burst'

    def get(self, request):
        phone = request.query_params.get('phone', '').strip()
        if not phone:
            return Response({'found': False, 'message': 'Telefon raqam berilmadi'}, status=status.HTTP_400_BAD_REQUEST)

        digits = ''.join(filter(str.isdigit, phone))
        if len(digits) < 9:
            return Response({'found': False, 'message': 'Telefon raqam kamida 9 ta raqamdan iborat bo‘lishi kerak'}, status=status.HTTP_400_BAD_REQUEST)

        contact = CustomerContact.objects.filter(phone=phone).first()
        if not contact:
            contact = CustomerContact.objects.filter(phone__icontains=digits[-9:]).first()

        if contact:
            return Response({
                'found': True,
                'customer': CustomerContactSerializer(contact).data
            })
        return Response({'found': False, 'message': 'Mijoz topilmadi'})
