import React from 'react';
import { COLORS, styles } from '../styles';

export default function CustomersTable({
  clientes,
  loading,
  error,
  onEditar,
  onEliminar,
}) {
  return (
    <div style={styles.tablaContenedor}>
      <table style={styles.tabla}>
        <thead>
          <tr>
            <th style={styles.th}>id</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}>Nombre de contacto</th>
            <th style={styles.th}>Dirección</th>
            <th style={styles.th}>Ciudad</th>
            <th style={styles.th}>Código postal</th>
            <th style={styles.th}>País</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td style={styles.tdMensaje} colSpan={8}>
                Cargando clientes...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={8}>
                Error al cargar: {error}
              </td>
            </tr>
          )}

          {!loading && !error && clientes.length === 0 && (
            <tr>
              <td style={styles.tdMensaje} colSpan={8}>
                No se encontraron clientes.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            clientes.map((c, i) => (
              <tr
                key={c.customerid}
                style={{
                  background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt,
                }}
              >
                <td style={styles.td}>{c.customerid}</td>
                <td style={styles.td}>{c.customername}</td>
                <td style={styles.td}>{c.contactname}</td>
                <td style={styles.td}>{c.address}</td>
                <td style={styles.td}>{c.city}</td>
                <td style={styles.td}>{c.postalcode}</td>
                <td style={styles.td}>{c.country}</td>
                <td style={styles.td}>
                  <button
                    style={styles.botonEditar}
                    onClick={() => onEditar(c.customerid)}
                  >
                    editar
                  </button>
                  <button
                    style={styles.botonEliminar}
                    onClick={() => onEliminar(c.customerid, c.customername)}
                  >
                    eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
