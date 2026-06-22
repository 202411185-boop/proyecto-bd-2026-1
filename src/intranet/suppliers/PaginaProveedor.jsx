import React, { useState } from 'react';
import { useSuppliers } from './hooks/useSuppliers';
import SearchBar from './components/SearchBar';
import SuppliersTable from './components/SuppliersTable';
import Pagination from './components/Pagination';
import SupplierModal from './components/SupplierModal';
import { styles } from './styles';

export default function PaginaProveedor() {
  const {
    proveedores,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleEliminar,
    handleGuardar,
  } = useSuppliers();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState(null); // null = modo "nuevo"

  const handleEditar = (supplierid) => {
    const proveedor = proveedores.find((p) => p.supplierid === supplierid);
    setProveedorEditando(proveedor || null);
    setModalAbierto(true);
  };

  const handleAgregar = () => {
    setProveedorEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEditando(null);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Proveedores</h1>

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

        <SuppliersTable
          proveedores={proveedores}
          loading={loading}
          error={error}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />

        <Pagination
          pagina={pagina}
          totalPaginas={totalPaginas}
          onCambiarPagina={setPagina}
        />
      </div>

      {modalAbierto && (
        <SupplierModal
          proveedor={proveedorEditando}
          onGuardar={handleGuardar}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
}
