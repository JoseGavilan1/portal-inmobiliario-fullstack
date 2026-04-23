import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PropertyDetail() {
  const { id } = useParams();
  
  const [property, setProperty] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(`portal-inmobiliario-fullstack-production.up.railway.app/api/properties/${id}/`)
      .then(res => res.json())
      .then(data => setProperty(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, property: id };

    fetch('portal-inmobiliario-fullstack-production.up.railway.app/api/contact/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if(res.ok) setEnviado(true);
    })
    .catch(err => console.error("Error al enviar:", err));
  };

  if (!property) return <div style={{ padding: '40px', color: '#e0e0e0' }}>Cargando detalles...</div>;

  const tieneCoordenadas = property.latitude && property.longitude;
  const posicion = tieneCoordenadas ? [property.latitude, property.longitude] : null;

  // --- CONFIGURACIÓN DE WHATSAPP ---
  // Reemplaza este número con el tuyo. Usa el código de país (56 para Chile) sin el signo +
  const numeroWhatsApp = "56912345678"; 
  // Armamos un mensaje automático para que sepas qué casa están mirando
  const mensajePredeterminado = `Hola, me interesa la propiedad: "${property.title}". ¿Podemos hablar para agendar una visita?`;
  // Codificamos el mensaje para que sea válido en una URL (cambia espacios por %20, etc.)
  const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajePredeterminado)}`;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', color: '#e0e0e0', position: 'relative' }}>
      <Link to="/" style={{ color: '#64b5f6', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Volver al listado
      </Link>
      
      <div style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', overflow: 'hidden', border: '1px solid #333' }}>
        {property.image && (
          <img src={property.image} alt={property.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
        )}
        
        <div style={{ padding: '30px' }}>
          <h1 style={{ color: '#64b5f6', marginBottom: '10px' }}>{property.title}</h1>
          <p style={{ color: '#888', marginBottom: '20px' }}>📍 {property.address}</p>
          
          <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', padding: '20px', backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
            <div>
              <span style={{ display: 'block', color: '#aaa', fontSize: '0.8rem' }}>PRECIO</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#81c784' }}>
                ${property.price.toLocaleString('es-CL')}
              </span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#aaa', fontSize: '0.8rem' }}>SUPERFICIE</span>
              <span style={{ fontSize: '1.2rem' }}>{property.square_meters} m²</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#aaa', fontSize: '0.8rem' }}>HAB / BAÑOS</span>
              <span style={{ fontSize: '1.2rem' }}>{property.bedrooms} / {property.bathrooms}</span>
            </div>
          </div>

          <h3 style={{ color: '#64b5f6', marginBottom: '10px' }}>Descripción</h3>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '40px' }}>{property.description}</p>

          <h3 style={{ color: '#64b5f6', marginBottom: '15px' }}>Ubicación</h3>
          {tieneCoordenadas ? (
            <div style={{ height: '400px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid #444', marginBottom: '40px' }}>
              <MapContainer center={posicion} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={posicion}>
                  <Popup>
                    <strong style={{ color: 'black' }}>{property.title}</strong>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
             <p style={{ color: '#e74c3c', padding: '20px', backgroundColor: '#2c2c2c', borderRadius: '10px', marginBottom: '40px' }}>
               Coordenadas no disponibles para esta propiedad.
             </p>
          )}

          <div style={{ padding: '30px', backgroundColor: '#2c2c2c', borderRadius: '15px', border: '1px solid #444' }}>
            <h3 style={{ color: '#64b5f6', marginBottom: '20px' }}>Contactar al Vendedor</h3>
            
            {enviado ? (
              <div style={{ padding: '20px', backgroundColor: '#1b5e20', color: '#c8e6c9', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                ¡Mensaje enviado con éxito! Nos contactaremos contigo pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <input 
                    name="name" placeholder="Tu Nombre" required 
                    onChange={handleChange}
                    style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: 'white' }}
                  />
                  <input 
                    name="phone" placeholder="Tu Teléfono (Opcional)" 
                    onChange={handleChange}
                    style={{ flex: 1, minWidth: '200px', padding: '12px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: 'white' }}
                  />
                </div>
                <input 
                  name="email" type="email" placeholder="Tu Email" required 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: 'white' }}
                />
                <textarea 
                  name="message" placeholder="¿En qué podemos ayudarte con esta propiedad?" required 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #555', backgroundColor: '#1e1e1e', color: 'white', minHeight: '120px', resize: 'vertical' }}
                />
                <button 
                  type="submit"
                  style={{ padding: '15px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'background-color 0.3s' }}
                >
                  Enviar Correo
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* --- BOTÓN FLOTANTE DE WHATSAPP --- */}
      <a 
        href={enlaceWhatsApp} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '1.4rem' }}>💬</span> Chatear ahora
      </a>

    </div>
  );
}

export default PropertyDetail;