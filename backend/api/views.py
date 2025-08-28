from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .models import Transaction, Budget, Category
from .serializers import TransactionSerializer, BudgetSerializer, CategorySerializer
from django.http import HttpResponse
import csv
from reportlab.pdfgen import canvas
from io import BytesIO
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, 'user_id', None) == request.user.id


class OwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class TransactionViewSet(OwnedModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filterset_fields = ["type", "category", "date"]
    search_fields = ["note"]
    ordering_fields = ["date", "amount", "created_at"]

    @action(detail=False, methods=["get"], url_path="export/csv")
    def export_csv(self, request):
        queryset = self.get_queryset()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="transactions.csv"'
        writer = csv.writer(response)
        writer.writerow(["date", "type", "amount", "category", "note"])
        for t in queryset:
            writer.writerow([t.date, t.type, t.amount, getattr(t.category, 'name', ''), t.note])
        return response

    @action(detail=False, methods=["get"], url_path="export/pdf")
    def export_pdf(self, request):
        queryset = self.get_queryset()
        buffer = BytesIO()
        p = canvas.Canvas(buffer)
        y = 800
        p.drawString(50, y, "Transactions Report")
        y -= 20
        for t in queryset[:500]:
            line = f"{t.date} | {t.type} | {t.amount} | {getattr(t.category, 'name', '')} | {t.note}"
            p.drawString(50, y, line[:110])
            y -= 15
            if y < 50:
                p.showPage()
                y = 800
        p.showPage()
        p.save()
        pdf = buffer.getvalue()
        buffer.close()
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="transactions.pdf"'
        return response


class BudgetViewSet(OwnedModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    filterset_fields = ["period", "start_date", "end_date"]


class CategoryViewSet(OwnedModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def google_login(request):
    token = request.data.get("id_token")
    if not token:
        return Response({"detail": "id_token required"}, status=400)
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
        if idinfo.get('aud') != settings.GOOGLE_CLIENT_ID:
            return Response({"detail": "Token audience mismatch"}, status=400)
        email = idinfo.get('email')
        if not email:
            return Response({"detail": "Email not present"}, status=400)
        user, _ = User.objects.get_or_create(username=email, defaults={"email": email})
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
    except Exception as e:
        return Response({"detail": "Invalid token"}, status=400)
