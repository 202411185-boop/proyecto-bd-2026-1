import React,{ useState} from 'react';
//importamos los hooks base y el nuevo reporte analítico
import { useEmployees, useEmployeesReport } from './hooks/useEmployees';
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

// Estado para controlar la apertura de la subinterfaz
  const [mostrarModal, setMostrarModal] = useState(false);

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

          {/* Contenedor horizontal para tus dos botones */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              style={{ ...styles.botonAgregar, backgroundColor: '#2e7d32' }} 
              onClick={() => setMostrarModal(true)}
            >
              Reporte Ventas
            </button>

            <button style={styles.botonAgregar} onClick={handleAgregar}>
              Agregar
            </button>
          </div>
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

       {/* RENDERIZADO CONDICIONAL DE LA SUBINTERFAZ */}
      {mostrarModal && (
        <SubinterfazVentasEmpleados onClose={() => setMostrarModal(false)} />
      )}

    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SUBCOMPONENTE: SubinterfazVentasEmpleados (Modal de la Vista SQL)
// ──────────────────────────────────────────────────────────────────
function SubinterfazVentasEmpleados({ onClose }) {
  // Consumimos los datos de la vista temporal filtrada desde el hook
  const { datosVentas, cargandoVentas, errorVentas } = useEmployeesReport();

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        width: '85%',
        maxWidth: '850px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        fontFamily: 'sans-serif'
      }}>
        {/* Cabecera del Reporte */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <h2 style={{ color: '#2e7d32', margin: 0 }}>Reporte Temporal: Ventas por Empleado</h2>
          <button 
            onClick={onClose} 
            style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cerrar ✕
          </button>
        </div>

        {/* Listado de la Tabla Analítica */}
        {cargandoVentas ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Cargando datos históricos...</p>
        ) : errorVentas ? (
          <p style={{ color: 'red', textAlign: 'center' }}>Error al conectar con la vista: {errorVentas}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#333' }}>ID Empleado</th>
                <th style={{ padding: '12px', color: '#333' }}>Nombre Empleado</th>
                <th style={{ padding: '12px', color: '#333', textAlign: 'center' }}>Año</th>
                <th style={{ padding: '12px', color: '#333', textAlign: 'center' }}>Mes</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#333' }}>Total Ventas</th>
              </tr>
            </thead>
            <tbody>
              {datosVentas.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: '#555' }}>{item.id_empleado}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{item.nombre_empleado}</td>
                  <td style={{ padding: '12px', color: '#555', textAlign: 'center', fontWeight: '500' }}>{item.anio}</td>
                  <td style={{ padding: '12px', color: '#555', textAlign: 'center' }}>{item.mes}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>
                    ${Number(item.total_ventas).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}