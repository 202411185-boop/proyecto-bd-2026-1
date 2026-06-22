import React from 'react';
import { COLORS, styles } from '../styles';

function formatearFecha(fecha) {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function EmployeesTable({
  empleados,
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
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Apellido</th>
            <th style={styles.th}>Primer nombre</th>
            <th style={styles.th}>Fecha de nacimiento</th>
            <th style={styles.th}>Notas</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td style={styles.tdMensaje} colSpan={6}>
                Cargando empleados...
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

          {!loading && !error && empleados.length === 0 && (
            <tr>
              <td style={styles.tdMensaje} colSpan={6}>
                No se encontraron empleados.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            empleados.map((e, i) => {
              const nombreCompleto = `${e.firstname} ${e.lastname}`;
              return (
                <tr
                  key={e.employeeid}
                  style={{
                    background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt,
                  }}
                >
                  <td style={styles.td}>{e.employeeid}</td>
                  <td style={styles.td}>{e.lastname}</td>
                  <td style={styles.td}>{e.firstname}</td>
                  <td style={styles.td}>{formatearFecha(e.birthdate)}</td>
                  <td style={{ ...styles.td, ...styles.notaCelda }}>
                    {e.notes || '—'}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.botonEditar}
                      onClick={() => onEditar(e.employeeid)}
                    >
                      editar
                    </button>
                    <button
                      style={styles.botonEliminar}
                      onClick={() => onEliminar(e.employeeid, nombreCompleto)}
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
