from rest_framework import viewsets
from .models import Property, ContactLead
from .serializers import PropertySerializer, ContactLeadSerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.filter(is_active=True)
    serializer_class = PropertySerializer

class ContactLeadViewSet(viewsets.ModelViewSet):
    queryset = ContactLead.objects.all()
    serializer_class = ContactLeadSerializer