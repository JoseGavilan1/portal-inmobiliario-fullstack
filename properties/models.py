from django.db import models

class Property(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título del anuncio")
    description = models.TextField(verbose_name="Descripción")
    price = models.DecimalField(max_digits=12, decimal_places=0, verbose_name="Precio")
    bedrooms = models.IntegerField(verbose_name="Habitaciones")
    bathrooms = models.IntegerField(verbose_name="Baños")
    square_meters = models.IntegerField(verbose_name="Metros Cuadrados")
    address = models.CharField(max_length=255, verbose_name="Dirección")
    is_active = models.BooleanField(default=True, verbose_name="¿Está disponible?")
    image = models.ImageField(upload_to='properties/', null=True, blank=True, verbose_name="Foto Principal")
    
    # Coordenadas para el mapa
    latitude = models.FloatField(null=True, blank=True, verbose_name="Latitud")
    longitude = models.FloatField(null=True, blank=True, verbose_name="Longitud")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de publicación")

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "Propiedad"
        verbose_name_plural = "Propiedades"
        ordering = ['-created_at']

class ContactLead(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='leads', verbose_name="Propiedad")
    name = models.CharField(max_length=100, verbose_name="Nombre")
    email = models.EmailField(verbose_name="Correo Electrónico")
    phone = models.CharField(max_length=20, verbose_name="Teléfono", blank=True)
    message = models.TextField(verbose_name="Mensaje")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de envío")

    def __str__(self):
        return f"Interés de {self.name} por {self.property.title}"

    class Meta:
        verbose_name = "Contacto"
        verbose_name_plural = "Contactos"