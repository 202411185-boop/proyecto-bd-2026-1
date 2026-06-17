// src/routing/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import ExtranetRoutes from '../extranet/routing/ExtranetRoutes';
import IntranetRoutes from '../intranet/routing/IntranetRoutes';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Cuando la URL sea "/" o cualquier subruta común, va a la Extranet */}
      {/* El uso de "/*" es clave para que reaccione a los enrutadores internos */}
      <Route path="/*" element={<ExtranetRoutes />} />

      {/* 2. Cuando la URL empiece con "/intranet", delega el control a la Intranet */}
      <Route path="/intranet/*" element={<IntranetRoutes />} />
    </Routes>
  );
}