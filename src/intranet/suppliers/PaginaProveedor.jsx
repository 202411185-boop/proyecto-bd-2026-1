import React from 'react';
import { useSuppliers } from './hooks/useSuppliers';
import SearchBar from './components/SearchBar';
import SuppliersTable from './components/SuppliersTable';
import Pagination from './components/Pagination';
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
  } = useSuppliers();

  const handleEditar = (supplierid) => {
    // TODO: conectar a modal o ruta de edición cuando esté lista
    console.log('Editar proveedor', supplierid);
  };

  const handleAgregar = () => {
    // TODO: conectar a modal o ruta de creación cuando esté lista
    console.log('Agregar nuevo proveedor');
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
    </div>
  );
}