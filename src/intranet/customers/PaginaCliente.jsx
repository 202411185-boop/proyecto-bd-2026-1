import React, { useState } from 'react';
// IMPORTANTE: Ahora importamos ambos hooks para que la subinterfaz tenga datos
import { useCustomers, useCustomersReport } from './hooks/useCustomers';
import SearchBar from './components/SearchBar';
import CustomersTable from './components/CustomersTable';
import Pagination from './components/Pagination';
import { styles } from './styles';

export default function PaginaCliente() {
  const {
    clientes,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleEliminar,
  } = useCustomers();

  // Estado para controlar si el reporte flotante se abre o se cierra
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleEditar = (customerid) => {
    console.log('Editar cliente', customerid);
  };

  const handleAgregar = () => {
    console.log('Agregar nuevo cliente');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.titulo}>Clientes</h1>

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
            Vista por Cliente
            </button>

            <button style={styles.botonAgregar} onClick={handleAgregar}>
              Agregar
            </button>
          </div>
        </div>

        <CustomersTable
          clientes={clientes}
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

      {/* RENDERIZADO DEL MODAL REAL */}
      {mostrarModal && (
        <SubinterfazVentasClientes onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SUBCOMPONENTE: SubinterfazVentasClientes (Modal Flotante Real)
// ──────────────────────────────────────────────────────────────────
function SubinterfazVentasClientes({ onClose }) {
  // Aquí es donde consumimos los datos que vienen directo de Supabase
  const { datosVentas, cargandoVentas, errorVentas } = useCustomersReport();

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
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        fontFamily: 'sans-serif'
      }}>
        {/* Cabecera del modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
          <h2 style={{ color: '#2e7d32', margin: 0 }}>📊 Reporte Consolidador: Ventas por Cliente</h2>
          <button 
            onClick={onClose} 
            style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Cerrar ✕
          </button>
        </div>

        {/* Cambios de estados dinámicos */}
        {cargandoVentas ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Cargando reporte de ventas...</p>
        ) : errorVentas ? (
          <p style={{ color: 'red', textAlign: 'center' }}>Error al cargar la vista de Supabase: {errorVentas}</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: '#333' }}>ID Cliente</th>
                <th style={{ padding: '12px', color: '#333' }}>Nombre Cliente</th>
                <th style={{ padding: '12px', color: '#333' }}>País / Región</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#333' }}>Total Ventas</th>
              </tr>
            </thead>
            <tbody>
              {datosVentas.map((item, index) => (
                <tr key={item.id_cliente || index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: '#555' }}>{item.id_cliente}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{item.nombre_cliente}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{item.pais_region}</td>
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