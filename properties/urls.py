from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, ContactLeadViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'contact', ContactLeadViewSet) # <-- Nueva ruta para el formulario

urlpatterns = [
    path('', include(router.urls)),
]