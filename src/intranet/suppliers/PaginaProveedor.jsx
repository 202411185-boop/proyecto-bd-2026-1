import React from 'react';
import { useSuppliers } from './hooks/useSuppliers';
import SearchBar from './components/SearchBar';
import SuppliersTable from './components/SuppliersTable';
import Pagination from './components/Pagination';
import ProveedorModal from './components/ProveedorModal';
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
    handleEditar,
    handleAbrirAgregar,
    handleCerrarModal,
    handleGuardar,
    modalConfig,
    guardando,
  } = useSuppliers();

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
          <button style={styles.botonAgregar} onClick={handleAbrirAgregar}>
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

      {modalConfig && (
        <ProveedorModal
          modo={modalConfig.modo}
          proveedor={modalConfig.proveedor}
          onGuardar={handleGuardar}
          onCerrar={handleCerrarModal}
          guardando={guardando}
        />
      )}
    </div>
  );
}
