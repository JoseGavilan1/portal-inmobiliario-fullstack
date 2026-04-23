from django.contrib import admin
from django.urls import path, include
from django.conf import settings # <-- Importamos las settings
from django.conf.urls.static import static # <-- Importamos la herramienta de estáticos

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('properties.urls')),
]

# Le decimos a Django que si estamos desarrollando, nos deje ver las fotos a través de la URL
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)