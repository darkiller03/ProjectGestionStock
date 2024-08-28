from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login_view, ProductViewSet, ClientViewSet, OrderViewSet, SupplierViewSet

# Set up the router for the API viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('login/', login_view, name='login'),  # Existing login view
    path('', include(router.urls)),  # API routes
]
