import React, { useState } from 'react';
import { COLORS, styles } from '../styles';

function formatearFecha(fechaISO) {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ───────────────────────────────────────────────
// HistorialClienteModal
// Muestra el historial retornado por sp_GetCustomerOrderHistory.
// Cada fila es una línea de producto dentro de un pedido.
// Se agrupa visualmente por orderid para mejor lectura.
// ───────────────────────────────────────────────
export default function HistorialClienteModal({
  customerid,
  historial,
  loadingHistorial,
  errorHistorial,
  onCerrar,
  onVerDetalles,
}) {
  const [filtroOrden, setFiltroOrden] = useState('');

  if (!customerid) return null;

  // Filtrar por orderid si el usuario escribe
  const filasFiltradas = filtroOrden.trim()
    ? historial.filter((h) => String(h.orderid).includes(filtroOrden.trim()))
    : historial;

  // Agrupar filas por orderid para mostrar la cabecera solo una vez por pedido
  const grupos = filasFiltradas.reduce((acc, fila) => {
    if (!acc[fila.orderid]) acc[fila.orderid] = [];
    acc[fila.orderid].push(fila);
    return acc;
  }, {});

  const totalPedidos = Object.keys(grupos).length;

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <div
        style={{ ...styles.modal, width: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <div>
            <h2 style={styles.modalTitulo}>Historial de Pedidos</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: COLORS.text }}>
              Cliente ID: <strong>{customerid}</strong>
              {!loadingHistorial && !errorHistorial && (
                <span style={{ marginLeft: '1rem' }}>
                  {totalPedidos} pedido{totalPedidos !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          <button style={styles.botonEliminar} onClick={onCerrar}>Salir</button>
        </div>

        {/* Buscador por orden */}
        <input
          type="text"
          placeholder="Filtrar por ID de orden..."
          value={filtroOrden}
          onChange={(e) => setFiltroOrden(e.target.value)}
          style={{ ...styles.buscador, width: '100%', marginBottom: '0.8rem' }}
        />

        {/* Tabla */}
        <div style={styles.tablaContenedor}>
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.th}>Orden ID</th>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistorial && (
                <tr><td style={styles.tdMensaje} colSpan={5}>Cargando historial...</td></tr>
              )}

              {!loadingHistorial && errorHistorial && (
                <tr>
                  <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={5}>
                    Error: {errorHistorial}
                  </td>
                </tr>
              )}

              {!loadingHistorial && !errorHistorial && filasFiltradas.length === 0 && (
                <tr>
                  <td style={styles.tdMensaje} colSpan={5}>
                    {historial.length === 0
                      ? 'Este cliente no tiene pedidos registrados.'
                      : 'No hay pedidos que coincidan con el filtro.'}
                  </td>
                </tr>
              )}

              {/* Filas agrupadas por orderid */}
              {!loadingHistorial && !errorHistorial &&
                Object.entries(grupos).map(([orderid, lineas], gi) => (
                  lineas.map((fila, li) => (
                    <tr
                      key={`${orderid}-${li}`}
                      style={{ background: gi % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt }}
                    >
                      {/* Mostrar orderid y fecha solo en la primera línea del grupo */}
                      <td style={{ ...styles.td, fontWeight: li === 0 ? 700 : 'normal', color: li === 0 ? COLORS.tableHeader : 'transparent' }}>
                        {li === 0 ? orderid : ''}
                      </td>
                      <td style={{ ...styles.td, color: li === 0 ? COLORS.text : 'transparent' }}>
                        {li === 0 ? formatearFecha(fila.orderdate) : ''}
                      </td>
                      <td style={styles.td}>{fila.productname}</td>
                      <td style={styles.td}>{fila.quantity}</td>
                      <td style={styles.td}>
                        {/* Botón solo en la primera línea del grupo */}
                        {li === 0 && (
                          <button
                            style={styles.botonVer}
                            onClick={() => onVerDetalles({ orderid: Number(orderid) })}
                          >
                            ver detalles
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ))
              }
            </tbody>
          </table>
        </div>

        {!loadingHistorial && !errorHistorial && totalPedidos > 0 && (
          <p style={{ textAlign: 'right', margin: '0.6rem 0 0', fontSize: '0.8rem', color: COLORS.text }}>
            {filasFiltradas.length} línea{filasFiltradas.length !== 1 ? 's' : ''} en {totalPedidos} pedido{totalPedidos !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
