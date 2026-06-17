// src/intranet/routing/IntranetRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import PaginaSumario from '../dashboard/PaginaSumario';
import PaginaInventario from '../inventory/PaginaInventario';
import PaginaTransporteOrdenes from '../orders/PaginaTransporteOrdenes';
import PaginaEmpleado from '../employees/PaginaEmpleado';
import PaginaProveedores from '../suppliers/PaginaProveedores';


export default function IntranetRoutes() {
  return (
    <Routes>
      {/* Ruta base de la intranet (Dashboard general) */}
      <Route path="/" element={<PaginaSumario />} />
      
      {/* Gestión de Inventario (WMS) */}
      <Route path="/inventario" element={<PaginaInventario />} />
      
      {/* Gestión de Órdenes */}
      <Route path="/ordenes" element={<PaginaTransporteOrdenes />} />
      
      {/* Gestión de Colaboradores */}
      <Route path="/personal" element={<PaginaEmpleado />} />

      {/* Gestión de Proveedores */}
      <Route path="/proveedores" element={<PaginaProveedores />} />
      
      <Route path="*" element={<div>404 - Sección administrativa no encontrada</div>} />
    </Routes>
  );
}