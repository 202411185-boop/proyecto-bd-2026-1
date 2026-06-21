import React from 'react';
import { useEmployees } from './hooks/useEmployees';
import SearchBar from './components/SearchBar';
import EmployeesTable from './components/EmployeesTable';
import Pagination from './components/Pagination';
import { styles } from './styles';

export default function PaginaEmpleado() {
  const {
    empleados,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleEliminar,
  } = useEmployees();

  const handleEditar = (employeeid) => {
    // TODO: conectar a modal o ruta de edición cuando esté lista
    console.log('Editar empleado', employeeid);
  };

  const handleAgregar = () => {
    // TODO: conectar a modal o ruta de creación cuando esté lista
    console.log('Agregar nuevo empleado');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Empleados</h1>

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

        <EmployeesTable
          empleados={empleados}
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