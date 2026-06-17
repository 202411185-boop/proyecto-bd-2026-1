// src/extranet/routing/ExtranetRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import PaginaPrincipal from '../home/PaginaPrincipal';
import PaginaLogeo from '../auth/PaginaLogeo';
import CheckoutPage from '../cart/CheckoutPage';
import PaginaPerfil from '../customer-profile/PaginaPerfil';

// Importa las páginas de la extranet (crea archivos vacíos si aún no existen)
// Ejemplo:
// import HomePage from '../home/pages/HomePage';
// import LoginPage from '../auth/pages/LoginPage';

export default function ExtranetRoutes() {
  return (
    <Routes>
      {/* Ruta de la landing/catálogo principal */}
      <Route path="/" element={<PaginaPrincipal />} />
      
      {/* Ruta de login de clientes */}
      <Route path="/login" element={<PaginaLogeo />} />
      
      {/* Ruta del carrito/checkout */}
      <Route path="/carrito" element={<CheckoutPage />} />

      {/* Ruta del perfil de usuario */}
      <Route path="/perfil" element={<PaginaPerfil />} />
      
      {/* Comodín para páginas no encontradas en la extranet */}
      <Route path="*" element={<div>404 - Página no encontrada en la tienda</div>} />
    </Routes>
  );
}