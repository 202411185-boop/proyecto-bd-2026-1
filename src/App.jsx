// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routing/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* Aquí puedes meter más adelante Proveedores de Contexto (AuthContext, CartContext) */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
