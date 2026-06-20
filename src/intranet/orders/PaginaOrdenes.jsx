import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import SearchBar from './components/SearchBar';
import OrdersTable from './components/OrdersTable';
import Pagination from './components/Pagination';
import OrderDetailsModal from './components/OrderDetailsModal';
import OrderFormModal from './components/OrderFormModal';
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
    crearOrden,
    actualizarOrden,
  } = useOrders();

  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null); // para "ver detalles"
  const [ordenEnEdicion, setOrdenEnEdicion] = useState(null); // null = creando, objeto = editando
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleVerDetalles = (orden) => setOrdenSeleccionada(orden);
  const handleCerrarDetalles = () => setOrdenSeleccionada(null);

  const handleAgregar = () => {
    setOrdenEnEdicion(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (orden) => {
    setOrdenEnEdicion(orden);
    setMostrarFormulario(true);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setOrdenEnEdicion(null);
  };

  const handleGuardar = async (payload) => {
    if (ordenEnEdicion) {
      await actualizarOrden(ordenEnEdicion.orderid, payload);
    } else {
      await crearOrden(payload);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Ordenes</h1>

      <div style={styles.panel}>
        <div style={styles.barraSuperior}>
          <SearchBar
            value={busqueda}
            onChange={handleBuscar}
            placeholder="Busca por nombre"
            style={styles.buscador}
          />
          <button style={styles.botonAgregar} onClick={handleAgregar}>
            Agregar
          </button>
        </div>

        <OrdersTable
          ordenes={ordenes}
          loading={loading}
          error={error}
          onVerDetalles={handleVerDetalles}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

        <Pagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPagina}
        />
      </div>

      {ordenSeleccionada && (
        <OrderDetailsModal orden={ordenSeleccionada} onCerrar={handleCerrarDetalles} />
      )}

      {mostrarFormulario && (
        <OrderFormModal
          orden={ordenEnEdicion}
          onGuardar={handleGuardar}
          onCerrar={handleCerrarFormulario}
        />
      )}
    </div>
  );
}
