import { useState } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  // Estado para el inicio de sesión falso
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  
  // Estados para guardar los datos de Django
  const [leads, setLeads] = useState([]);
  const [propiedades, setPropiedades] = useState([]);

  // Simulador de Login
  const handleLogin = (e) => {
    e.preventDefault();
    // La contraseña maestra es "admin123"
    if (password === 'admin123') {
      setAutenticado(true);
      cargarDatos();
    } else {
      alert('❌ Contraseña incorrecta. Acceso denegado.');
    }
  };

  // Función para ir a buscar TODO a Django
  const cargarDatos = () => {
    // 1. Buscamos los mensajes de contacto
    fetch('portal-inmobiliario-fullstack-production.up.railway.app/api/contact/')
      .then(res => res.json())
      .then(data => setLeads(data))
      .catch(err => console.error(err));

    // 2. Buscamos las propiedades
    fetch('portal-inmobiliario-fullstack-production.up.railway.app/api/properties/')
      .then(res => res.json())
      .then(data => setPropiedades(data))
      .catch(err => console.error(err));
  };

  // Función para cruzar los datos (buscar el nombre de la casa según el ID que guardó el Lead)
  const getNombrePropiedad = (id) => {
    const prop = propiedades.find(p => p.id === id);
    return prop ? prop.title : `Propiedad #${id}`;
  };

  // ==========================================
  // PANTALLA 1: BLOQUEO DE INICIO DE SESIÓN
  // ==========================================
  if (!autenticado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '15px', border: '1px solid #333', textAlign: 'center', width: '350px' }}>
          <h2 style={{ color: '#64b5f6', marginBottom: '20px' }}>Acceso Restringido</h2>
          <p style={{ color: '#888', marginBottom: '20px', fontSize: '0.9rem' }}>Panel exclusivo para la Inmobiliaria</p>
          <input 
            type="password" 
            placeholder="Ingrese contraseña..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2c2c2c', color: 'white', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2980b9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Ingresar
          </button>
          <Link to="/" style={{ display: 'block', marginTop: '20px', color: '#aaa', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver al portal público</Link>
        </form>
      </div>
    );
  }

  // ==========================================
  // PANTALLA 2: EL DASHBOARD PRIVADO
  // ==========================================
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Cabecera del Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#64b5f6', margin: 0 }}>⚙️ Panel de Administración</h1>
          <p style={{ color: '#888', margin: '5px 0 0 0' }}>Bienvenido. Aquí puedes gestionar tus contactos.</p>
        </div>
        <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
          Ver Sitio Público
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: Mensajes Recibidos (Leads) */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <h2 style={{ color: '#81c784', marginBottom: '20px' }}>📬 Nuevos Mensajes ({leads.length})</h2>
          
          {leads.length === 0 ? (
            <p style={{ color: '#aaa' }}>No hay mensajes nuevos por el momento.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {leads.slice().reverse().map(lead => (
                <div key={lead.id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '12px', border: '1px solid #333', borderLeft: '5px solid #64b5f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{lead.name}</h3>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#aaa' }}>✉️ {lead.email} | 📞 {lead.phone || 'No registrado'}</p>
                  <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#f39c12' }}>🏡 Interesado en: <strong>{getNombrePropiedad(lead.property)}</strong></p>
                  
                  <div style={{ backgroundColor: '#2c2c2c', padding: '15px', borderRadius: '8px', color: '#ddd', fontSize: '0.95rem', fontStyle: 'italic' }}>
                    "{lead.message}"
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: Resumen de Propiedades */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h2 style={{ color: '#64b5f6', marginBottom: '20px' }}>🏡 Mis Propiedades ({propiedades.length})</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {propiedades.map(prop => (
              <div key={prop.id} style={{ backgroundColor: '#1e1e1e', padding: '15px', borderRadius: '12px', border: '1px solid #333', display: 'flex', gap: '15px', alignItems: 'center' }}>
                {prop.image ? (
                  <img src={prop.image} alt="Casa" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: '#333' }}></div>
                )}
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1rem' }}>{prop.title}</h4>
                  <span style={{ color: '#81c784', fontWeight: 'bold', fontSize: '0.9rem' }}>${prop.price.toLocaleString('es-CL')}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;