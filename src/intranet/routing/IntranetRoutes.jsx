// src/intranet/routing/IntranetRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import MenuIntranet from '../layout/MenuIntranet';
import PaginaSumario from '../dashboard/PaginaSumario';
import PaginaProducto from '../products/PaginaProducto';
import PaginaOrdenes from '../orders/PaginaOrdenes';
import PaginaEmpleado from '../employees/PaginaEmpleado';
import PaginaProveedor from '../suppliers/PaginaProveedor';
import PaginaTransporte from '../shippers/PaginaTransporte';
import PaginaCliente from '../customers/PaginaCliente';


export default function IntranetRoutes() {
  return (
  <MenuIntranet>
    <Routes>
      {/* Ruta base de la intranet (Dashboard general) */}
      <Route path="/" element={<PaginaSumario />} />
      
      {/* Gestión de Inventario (WMS) */}
      <Route path="/producto" element={<PaginaProducto />} />
      
      {/* Gestión de Órdenes */}
      <Route path="/ordenes" element={<PaginaOrdenes />} />
      
      {/* Gestión de Colaboradores */}
      <Route path="/personal" element={<PaginaEmpleado />} />

      {/* Gestión de Proveedores */}
      <Route path="/proveedor" element={<PaginaProveedor/>} />
      
      {/* Gestión de Transporte */}
      <Route path="/transporte" element={<PaginaTransporte/>} />
      
      {/* Gestión de Clientes */}
      <Route path="/cliente" element={<PaginaCliente/>} />

      <Route path="*" element={<div>404 - Sección administrativa no encontrada</div>} />
    </Routes>
  </MenuIntranet>
  );
}