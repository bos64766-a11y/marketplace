from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from apps.products.models import Product, Category
from apps.orders.models import RequestOrder, CustomerContact, OrderItem


class DashboardAnalyticsView(APIView):
    def get(self, request):
        now = timezone.now()
        total_products = Product.objects.count()
        in_stock_products = Product.objects.filter(in_stock=True).count()
        out_of_stock_products = total_products - in_stock_products

        total_orders = RequestOrder.objects.count()
        pending_orders = RequestOrder.objects.filter(status='Ko‘rib chiqilmoqda').count()
        completed_orders = RequestOrder.objects.filter(status='Bajarildi').count()

        total_revenue = RequestOrder.objects.exclude(status='Bekor qilingan').aggregate(
            total=Sum('total_amount')
        )['total'] or 0

        # Estimated expenses (approx 25-30% of turnover in B2B supply logistics)
        estimated_expenses = float(total_revenue) * 0.28

        # 7-day weekly bar chart data
        days = ['dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba', 'yakshanba']
        weekday_map = {0: 'dushanba', 1: 'seshanba', 2: 'chorshanba', 3: 'payshanba', 4: 'juma', 5: 'shanba', 6: 'yakshanba'}
        
        # Calculate recent days distribution
        weekly_counts = {d: 0 for d in days}
        one_week_ago = now - timedelta(days=7)
        recent_orders = RequestOrder.objects.filter(created_at__gte=one_week_ago)
        for ord in recent_orders:
            w_name = weekday_map.get(ord.created_at.weekday(), 'payshanba')
            weekly_counts[w_name] += 1

        # Real weekly counts (no artificial max(..., 18))
        weekly_chart = [
            {'day': 'dush', 'fullName': 'dushanba', 'value': weekly_counts['dushanba'], 'active': False},
            {'day': 'sesh', 'fullName': 'seshanba', 'value': weekly_counts['seshanba'], 'active': False},
            {'day': 'chor', 'fullName': 'chorshanba', 'value': weekly_counts['chorshanba'], 'active': False},
            {'day': 'pay', 'fullName': 'payshanba', 'value': weekly_counts['payshanba'], 'active': False},
            {'day': 'juma', 'fullName': 'juma', 'value': weekly_counts['juma'], 'active': False},
            {'day': 'shan', 'fullName': 'shanba', 'value': weekly_counts['shanba'], 'active': False},
            {'day': 'yak', 'fullName': 'yakshanba', 'value': weekly_counts['yakshanba'], 'active': False},
        ]

        # Category share for Donut Chart based on real products
        categories = Category.objects.annotate(prod_count=Count('products')).order_by('-prod_count')[:5]
        colors = ['#FF5A00', '#FF7A29', '#FFA800', '#FFC72C', '#3B82F6']
        donut_segments = []
        cat_sum = sum(c.prod_count for c in categories) or 1
        for idx, cat in enumerate(categories):
            pct = round((cat.prod_count / cat_sum) * 100) if cat_sum > 0 else 0
            donut_segments.append({
                'label': cat.name,
                'pct': pct,
                'color': colors[idx % len(colors)],
            })

        # Calculate real daily revenue over past 7 days
        daily_revenue = {d: 0.0 for d in days}
        for ord in recent_orders:
            w_name = weekday_map.get(ord.created_at.weekday(), 'dushanba')
            daily_revenue[w_name] += float(ord.total_amount or 0)

        monthly_revenue_curve = [
            {'label': 'Dush', 'val': round(daily_revenue['dushanba'] / 1_000_000, 2)},
            {'label': 'Sesh', 'val': round(daily_revenue['seshanba'] / 1_000_000, 2)},
            {'label': 'Chor', 'val': round(daily_revenue['chorshanba'] / 1_000_000, 2)},
            {'label': 'Pay', 'val': round(daily_revenue['payshanba'] / 1_000_000, 2)},
            {'label': 'Jum', 'val': round(daily_revenue['juma'] / 1_000_000, 2)},
            {'label': 'Shan', 'val': round(daily_revenue['shanba'] / 1_000_000, 2)},
            {'label': 'Yak', 'val': round(daily_revenue['yakshanba'] / 1_000_000, 2)},
        ]

        # Real order status breakdown
        status_counts = {
            'pending': RequestOrder.objects.filter(status='Ko‘rib chiqilmoqda').count(),
            'confirmed': RequestOrder.objects.filter(status='Tasdiqlangan').count(),
            'delivering': RequestOrder.objects.filter(status='Yetkazilmoqda').count(),
            'completed': RequestOrder.objects.filter(status='Bajarildi').count(),
        }

        # Top 5 products by order items
        top_order_items = (
            OrderItem.objects.values('product_name', 'price', 'product_sku')
            .annotate(total_qty=Sum('quantity'), total_sum=Sum('total_price'))
            .order_by('-total_qty')[:5]
        )

        return Response({
            'kpi': {
                'totalProducts': total_products,
                'inStockProducts': in_stock_products,
                'outOfStockProducts': out_of_stock_products,
                'totalOrders': total_orders,
                'pendingOrders': pending_orders,
                'completedOrders': completed_orders,
                'totalRevenue': float(total_revenue),
                'totalRevenueFormatted': f"{int(total_revenue):,} so‘m".replace(',', ' '),
                'estimatedExpenses': int(estimated_expenses),
                'estimatedExpensesFormatted': f"{int(estimated_expenses):,} so‘m".replace(',', ' '),
            },
            'weeklyChart': weekly_chart,
            'donutChart': donut_segments,
            'revenueCurve': monthly_revenue_curve,
            'statusCounts': status_counts,
            'topProducts': list(top_order_items),
        })
