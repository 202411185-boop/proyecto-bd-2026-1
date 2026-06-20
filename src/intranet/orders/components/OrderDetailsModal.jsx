import React from 'react';
import { styles } from '../styles';

function formatearFecha(fechaISO) {
  if (!fechaISO) return '—';
  const fecha = new Date(fechaISO);
  if (Number.isNaN(fecha.getTime())) return fechaISO;
  return fecha.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export default function OrderDetailsModal({ orden, onCerrar }) {
  if (!orden) return null;

  const nombreCliente = orden.customers?.companyname || `Cliente #${orden.customerid}`;
  const nombreEmpleado = orden.employees
    ? `${orden.employees.firstname ?? ''} ${orden.employees.lastname ?? ''}`.trim()
    : `Personal #${orden.employeeid}`;
  const nombreTransporte = orden.shippers?.companyname || `Transporte #${orden.shipperid}`;

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitulo}>Orden #{orden.orderid}</h2>

        <div style={styles.detalleFila}>
          <span style={styles.detalleLabel}>Cliente</span>
          <span style={styles.detalleValor}>{nombreCliente}</span>
        </div>
        <div style={styles.detalleFila}>
          <span style={styles.detalleLabel}>Personal</span>
          <span style={styles.detalleValor}>{nombreEmpleado}</span>
        </div>
        <div style={styles.detalleFila}>
          <span style={styles.detalleLabel}>Fecha de orden</span>
          <span style={styles.detalleValor}>{formatearFecha(orden.orderdate)}</span>
        </div>
        <div style={styles.detalleFila}>
          <span style={styles.detalleLabel}>Transporte</span>
          <span style={styles.detalleValor}>{nombreTransporte}</span>
        </div>

        <div style={styles.accionesModal}>
          <button style={styles.botonCancelar} onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
