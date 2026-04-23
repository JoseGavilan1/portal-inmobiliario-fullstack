import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Dashboard from './pages/Dashboard'; // <-- Importamos el nuevo panel

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#e0e0e0' }}>
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />
          
          {/* NUEVA RUTA OCULTA PARA EL DUEÑO */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;