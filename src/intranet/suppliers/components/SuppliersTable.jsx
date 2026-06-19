import React from 'react';
import { COLORS, styles } from '../styles';

export default function SuppliersTable({
  proveedores,
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
            <th style={styles.th}>proveedores</th>
            <th style={styles.th}>nombre de contacto</th>
            <th style={styles.th}>dirección</th>
            <th style={styles.th}>ciudad</th>
            <th style={styles.th}>código postal</th>
            <th style={styles.th}>country</th>
            <th style={styles.th}>teléfono</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td style={styles.tdMensaje} colSpan={9}>
                Cargando proveedores...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={9}>
                Error al cargar: {error}
              </td>
            </tr>
          )}

          {!loading && !error && proveedores.length === 0 && (
            <tr>
              <td style={styles.tdMensaje} colSpan={9}>
                No se encontraron proveedores.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            proveedores.map((p, i) => (
              <tr
                key={p.supplierid}
                style={{
                  background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt,
                }}
              >
                <td style={styles.td}>{p.supplierid}</td>
                <td style={styles.td}>{p.suppliername}</td>
                <td style={styles.td}>{p.contactname}</td>
                <td style={styles.td}>{p.address}</td>
                <td style={styles.td}>{p.city}</td>
                <td style={styles.td}>{p.postalcode}</td>
                <td style={styles.td}>{p.country}</td>
                <td style={styles.td}>{p.phone}</td>
                <td style={styles.td}>
                  <button
                    style={styles.botonEditar}
                    onClick={() => onEditar(p.supplierid)}
                  >
                    editar
                  </button>
                  <button
                    style={styles.botonEliminar}
                    onClick={() => onEliminar(p.supplierid, p.suppliername)}
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