import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PropertyList() {
  const [properties, setProperties] = useState([])
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroPrecioMaximo, setFiltroPrecioMaximo] = useState(1000000000)
  const [filtroHabitaciones, setFiltroHabitaciones] = useState(0)

  // NUEVO ESTADO: Memoria de Favoritos
  // Al iniciar, busca si hay favoritos guardados previamente en el navegador
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos_inmobiliaria');
    return guardados ? JSON.parse(guardados) : [];
  });

  // Traer las propiedades desde Django
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/properties/')
      .then(respuesta => respuesta.json())
      .then(datos => setProperties(datos))
      .catch(error => console.error("Error al traer los datos:", error))
  }, [])

  // NUEVA FUNCIÓN: Agregar o quitar de favoritos
  const toggleFavorito = (id) => {
    let nuevosFavoritos;
    if (favoritos.includes(id)) {
      // Si ya estaba, lo quitamos
      nuevosFavoritos = favoritos.filter(favId => favId !== id);
    } else {
      // Si no estaba, lo agregamos
      nuevosFavoritos = [...favoritos, id];
    }
    // Actualizamos la pantalla
    setFavoritos(nuevosFavoritos);
    // Guardamos en la memoria del navegador para la próxima vez
    localStorage.setItem('favoritos_inmobiliaria', JSON.stringify(nuevosFavoritos));
  };

  const propiedadesFiltradas = properties.filter(propiedad => {
    const coincideTexto = propiedad.title.toLowerCase().includes(filtroTexto.toLowerCase()) || 
                          propiedad.address.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincidePrecio = propiedad.price <= filtroPrecioMaximo;
    const coincideHabitaciones = filtroHabitaciones === 0 || propiedad.bedrooms >= filtroHabitaciones;
    return coincideTexto && coincidePrecio && coincideHabitaciones;
  });

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#e0e0e0' }}>
      <h1 style={{ color: '#64b5f6', borderBottom: '3px solid #3498db', paddingBottom: '10px' }}>
        🏡 Portal Inmobiliario
      </h1>

      <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', margin: '20px 0', display: 'flex', gap: '20px', flexWrap: 'wrap', border: '1px solid #333' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Buscar por nombre o dirección:</label>
          <input 
            type="text" 
            placeholder="Ej. Providencia, Parcela..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: 'white' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Precio Máximo: ${filtroPrecioMaximo.toLocaleString('es-CL')}</label>
          <input 
            type="range" 
            min="10000000" 
            max="1000000000" 
            step="10000000"
            value={filtroPrecioMaximo}
            onChange={(e) => setFiltroPrecioMaximo(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#64b5f6' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Habitaciones (Min):</label>
          <select 
            value={filtroHabitaciones}
            onChange={(e) => setFiltroHabitaciones(Number(e.target.value))}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: 'white' }}
          >
            <option value={0}>Todas</option>
            <option value={1}>1 o más</option>
            <option value={2}>2 o más</option>
            <option value={4}>4 o más</option>
          </select>
        </div>
      </div>
      
      <p style={{ color: '#aaa', marginBottom: '20px' }}>
        Mostrando {propiedadesFiltradas.length} propiedades encontradas
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {propiedadesFiltradas.map(property => {
          // Revisamos si esta propiedad en particular está en la lista de favoritos
          const esFavorito = favoritos.includes(property.id);

          return (
            <div key={property.id} style={{ border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e1e1e', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              
              {/* BOTÓN FLOTANTE DE FAVORITOS */}
              <button 
                onClick={() => toggleFavorito(property.id)}
                style={{ 
                  position: 'absolute', top: '15px', right: '15px', 
                  backgroundColor: esFavorito ? 'white' : 'rgba(0,0,0,0.5)', 
                  border: 'none', borderRadius: '50%', width: '40px', height: '40px', 
                  fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)', transition: 'all 0.2s', zIndex: 10 
                }}
              >
                {esFavorito ? '❤️' : '🤍'}
              </button>

              {property.image ? (
                <img 
                  src={property.image} 
                  alt={property.title} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '220px', backgroundColor: '#2c2c2c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  Sin imagen
                </div>
              )}
              
              <div style={{ padding: '20px', flexGrow: 1 }}>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#64b5f6' }}>{property.title}</h2>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 15px 0', color: '#81c784' }}>
                  ${property.price.toLocaleString('es-CL')}
                </p>
                <div style={{ display: 'flex', gap: '15px', color: '#aaa', marginBottom: '15px', fontSize: '0.9rem' }}>
                  <span>🛏️ {property.bedrooms} hab</span>
                  <span>🛁 {property.bathrooms} baños</span>
                  <span>📐 {property.square_meters} m²</span>
                </div>
                <p style={{ margin: '0 0 15px 0', color: '#ccc', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {property.description.substring(0, 100)}...
                </p>
                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem', paddingBottom: '15px' }}>📍 {property.address}</p>
              </div>
              
              <Link 
                to={`/propiedad/${property.id}`} 
                style={{ display: 'block', textAlign: 'center', backgroundColor: '#2980b9', color: 'white', padding: '15px', textDecoration: 'none', fontWeight: 'bold', borderTop: '1px solid #333', transition: 'background-color 0.3s' }}
              >
                Ver Detalles de Propiedad
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PropertyList;