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

export default function OrdersTable({
  ordenes,
  loading,
  error,
  onVerDetalles,
  onEditar,
  onEliminar,
}) {
  return (
    <div style={styles.tablaContenedor}>
      <table style={styles.tabla}>
        <thead>
          <tr>
            <th style={styles.th}>ordenes id</th>
            <th style={styles.th}>cliente</th>
            <th style={styles.th}>personal</th>
            <th style={styles.th}>fecha de orden</th>
            <th style={styles.th}>transporte</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td style={styles.tdMensaje} colSpan={6}>
                Cargando órdenes...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={6}>
                Error al cargar: {error}
              </td>
            </tr>
          )}

          {!loading && !error && ordenes.length === 0 && (
            <tr>
              <td style={styles.tdMensaje} colSpan={6}>
                No se encontraron órdenes.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            ordenes.map((o, i) => {
              const nombreCliente = o.customers?.companyname || `Cliente #${o.customerid}`;
              const nombreEmpleado = o.employees
                ? `${o.employees.firstname ?? ''} ${o.employees.lastname ?? ''}`.trim()
                : `Personal #${o.employeeid}`;
              const nombreTransporte = o.shippers?.companyname || `Transporte #${o.shipperid}`;

              return (
                <tr
                  key={o.orderid}
                  style={{
                    background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt,
                  }}
                >
                  <td style={styles.td}>{o.orderid}</td>
                  <td style={styles.td}>{nombreCliente}</td>
                  <td style={styles.td}>{nombreEmpleado}</td>
                  <td style={styles.td}>{formatearFecha(o.orderdate)}</td>
                  <td style={styles.td}>{nombreTransporte}</td>
                  <td style={styles.td}>
                    <button style={styles.botonVer} onClick={() => onVerDetalles(o)}>
                      ver detalles
                    </button>
                    <button style={styles.botonEditar} onClick={() => onEditar(o)}>
                      editar
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
