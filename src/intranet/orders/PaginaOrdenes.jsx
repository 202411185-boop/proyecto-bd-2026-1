import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import SearchBar from './components/SearchBar';
import OrdersTable from './components/OrdersTable';
import Pagination from './components/Pagination';
import OrderDetailsModal from './components/OrderDetailsModal';
import NuevoPedidoModal from './components/NuevoPedidoModal';
import HistorialClienteModal from './components/HistorialClienteModal';
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
    handleCrearPedido,
    handleVerHistorial,
    limpiarHistorial,
    historial,
    loadingHistorial,
    errorHistorial,
  } = useOrders();

  // ── Modal: detalles de una orden específica ──────────────────────────────
  const [orderidSeleccionado, setOrderidSeleccionado] = useState(null);
  const handleVerDetalles = (orden) => setOrderidSeleccionado(orden.orderid);
  const handleCerrarDetalles = () => setOrderidSeleccionado(null);

  // ── Modal: nuevo pedido ──────────────────────────────────────────────────
  const [mostrarNuevoPedido, setMostrarNuevoPedido] = useState(false);

  // ── Modal: historial de cliente ──────────────────────────────────────────
  const [customeridHistorial, setCustomeridHistorial] = useState(null);

  const abrirHistorial = async (customerid) => {
    setCustomeridHistorial(customerid);
    await handleVerHistorial(customerid);
  };

  const cerrarHistorial = () => {
    setCustomeridHistorial(null);
    limpiarHistorial();
  };

  // Desde el historial se puede saltar a ver detalles de una orden concreta
  const handleVerDetallesDesdeHistorial = (orden) => {
    cerrarHistorial();
    setOrderidSeleccionado(orden.orderid);
  };

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

          {/* Botón para abrir el formulario de nuevo pedido */}
          <button
            style={styles.botonAgregar}
            onClick={() => setMostrarNuevoPedido(true)}
          >
            + Nuevo Pedido
          </button>
        </div>

        <OrdersTable
          ordenes={ordenes}
          loading={loading}
          error={error}
          onVerDetalles={handleVerDetalles}
          onEliminar={handleEliminar}
          onVerHistorial={abrirHistorial}
        />

        <Pagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPagina}
        />
      </div>

      {/* Modal: detalles de una orden */}
      {orderidSeleccionado && (
        <OrderDetailsModal orderid={orderidSeleccionado} onCerrar={handleCerrarDetalles} />
      )}

      {/* Modal: registrar nuevo pedido */}
      {mostrarNuevoPedido && (
        <NuevoPedidoModal
          onCerrar={() => setMostrarNuevoPedido(false)}
          handleCrearPedido={handleCrearPedido}
        />
      )}

      {/* Modal: historial de pedidos del cliente */}
      {customeridHistorial !== null && (
        <HistorialClienteModal
          customerid={customeridHistorial}
          historial={historial}
          loadingHistorial={loadingHistorial}
          errorHistorial={errorHistorial}
          onCerrar={cerrarHistorial}
          onVerDetalles={handleVerDetallesDesdeHistorial}
        />
      )}
    </div>
  );
}
