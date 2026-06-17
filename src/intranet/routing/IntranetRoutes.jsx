// src/intranet/routing/IntranetRoutes.jsx
import { Routes, Route } from 'react-router-dom';

export default function IntranetRoutes() {
  return (
    <Routes>
      {/* Ruta base de la intranet (Dashboard general) */}
      <Route path="/" element={<div>📊 Dashboard Principal (Indicadores de Ventas)</div>} />
      
      {/* Gestión de Inventario (WMS) */}
      <Route path="/inventario" element={<div>📦 Módulo de Inventario (Products)</div>} />
      
      {/* Gestión de Órdenes */}
      <Route path="/ordenes" element={<div>📋 Control de Pedidos (Orders)</div>} />
      
      {/* Gestión de Colaboradores */}
      <Route path="/personal" element={<div>👥 Control de Personal (Employees)</div>} />

      {/* Gestión de Proveedores */}
      <Route path="/proveedores" element={<div>🚚 Gestión de Proveedores (Suppliers)</div>} />
      
      <Route path="*" element={<div>404 - Sección administrativa no encontrada</div>} />
    </Routes>
  );
}