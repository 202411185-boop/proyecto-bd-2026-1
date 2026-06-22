import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import SearchBar from './components/SearchBar';
import OrdersTable from './components/OrdersTable';
import Pagination from './components/Pagination';
import OrderDetailsModal from './components/OrderDetailsModal';
import { styles } from './styles';

export default function PaginaOrdenes() {
  const {
    ordenes,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleEliminar,
  } = useOrders();

  const [orderidSeleccionado, setOrderidSeleccionado] = useState(null);

  const handleVerDetalles = (orden) => setOrderidSeleccionado(orden.orderid);
  const handleCerrarDetalles = () => setOrderidSeleccionado(null);

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Ordenes</h1>

      <div style={styles.panel}>
        <div style={styles.barraSuperior}>
          <SearchBar
            value={busqueda}
            onChange={handleBuscar}
            placeholder="Busca por ID de cliente"
            style={styles.buscador}
          />
        </div>

        <OrdersTable
          ordenes={ordenes}
          loading={loading}
          error={error}
          onVerDetalles={handleVerDetalles}
          onEliminar={handleEliminar}
        />

        <Pagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPagina}
        />
      </div>

      {orderidSeleccionado && (
        <OrderDetailsModal orderid={orderidSeleccionado} onCerrar={handleCerrarDetalles} />
      )}
    </div>
  );
}
