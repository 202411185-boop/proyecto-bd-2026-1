import React from 'react';
import { COLORS, styles } from '../styles';

function formatearFecha(fechaISO) {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default function OrdersTable({ ordenes, loading, error, onVerDetalles, onEliminar }) {
  return (
    <div style={styles.tablaContenedor}>
      <table style={styles.tabla}>
        <thead>
          <tr>
            <th style={styles.th}>ordenes id</th>
            <th style={styles.th}>cliente id</th>
            <th style={styles.th}>cliente</th>
            <th style={styles.th}>empleado id</th>
            <th style={styles.th}>fecha de orden</th>
            <th style={styles.th}>transporte id</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td style={styles.tdMensaje} colSpan={7}>
                Cargando órdenes...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={7}>
                Error al cargar: {error}
              </td>
            </tr>
          )}

          {!loading && !error && ordenes.length === 0 && (
            <tr>
              <td style={styles.tdMensaje} colSpan={7}>
                No se encontraron órdenes.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            ordenes.map((o, i) => {
              const nombreCliente = o.customers?.customername || '—';

              return (
                <tr
                  key={o.orderid}
                  style={{ background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt }}
                >
                  <td style={styles.td}>{o.orderid}</td>
                  <td style={styles.td}>{o.customerid}</td>
                  <td style={styles.td}>{nombreCliente}</td>
                  <td style={styles.td}>{o.employeeid}</td>
                  <td style={styles.td}>{formatearFecha(o.orderdate)}</td>
                  <td style={styles.td}>{o.shipperid}</td>
                  <td style={styles.td}>
                    <button style={styles.botonVer} onClick={() => onVerDetalles(o)}>
                      ver detalles
                    </button>
                    <button
                      style={styles.botonEliminar}
                      onClick={() => onEliminar(o.orderid)}
                    >
                      eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
