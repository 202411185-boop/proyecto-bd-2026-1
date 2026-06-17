// src/extranet/routing/ExtranetRoutes.jsx
import { Routes, Route } from 'react-router-dom';

// Importa las páginas de tu extranet (crea archivos vacíos si aún no existen)
// Ejemplo:
// import HomePage from '../home/pages/HomePage';
// import LoginPage from '../auth/pages/LoginPage';

export default function ExtranetRoutes() {
  return (
    <Routes>
      {/* Ruta de la landing/catálogo principal */}
      <Route path="/" element={<div>🛒 Catálogo de Tienda (Home)</div>} />
      
      {/* Ruta de login de clientes */}
      <Route path="/login" element={<div>🔑 Login de Clientes</div>} />
      
      {/* Ruta del carrito/checkout */}
      <Route path="/carrito" element={<div>🛒 Carrito de Compras</div>} />

      {/* Ruta del perfil de usuario */}
      <Route path="/perfil" element={<div>👤 Perfil del Cliente</div>} />
      
      {/* Comodín para páginas no encontradas en la extranet */}
      <Route path="*" element={<div>404 - Página no encontrada en la tienda</div>} />
    </Routes>
  );
}