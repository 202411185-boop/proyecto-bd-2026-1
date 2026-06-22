import React, { useState } from 'react';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { COLORS, styles } from '../styles';

export default function OrderDetailsModal({ orderid, onCerrar }) {
  const { lineas, loading, error } = useOrderDetail(orderid);
  const [busqueda, setBusqueda] = useState('');

  if (!orderid) return null;

  const texto = busqueda.trim().toLowerCase();
  const lineasFiltradas = texto
    ? lineas.filter((l) =>
        (l.products?.productname || '').toLowerCase().includes(texto)
      )
    : lineas;

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <div
        style={{ ...styles.modal, width: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={styles.modalTitulo}>Detalles de la orden</h2>
          <button style={styles.botonEliminar} onClick={onCerrar}>
            Salir
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.buscador, width: '100%', marginBottom: '1rem' }}
        />

        <div style={styles.tablaContenedor}>
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.th}>id detalle de orden</th>
                <th style={styles.th}>id orden</th>
                <th style={styles.th}>id producto</th>
                <th style={styles.th}>nombre producto</th>
                <th style={styles.th}>cantidad</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td style={styles.tdMensaje} colSpan={5}>
                    Cargando detalles...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td style={{ ...styles.tdMensaje, color: COLORS.delete }} colSpan={5}>
                    Error al cargar: {error}
                  </td>
                </tr>
              )}

              {!loading && !error && lineasFiltradas.length === 0 && (
                <tr>
                  <td style={styles.tdMensaje} colSpan={5}>
                    No hay productos asociados a este pedido.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                lineasFiltradas.map((l, i) => (
                  <tr
                    key={l.orderdetailid}
                    style={{ background: i % 2 === 0 ? COLORS.rowBase : COLORS.rowAlt }}
                  >
                    <td style={styles.td}>{l.orderdetailid}</td>
                    <td style={styles.td}>{l.orderid}</td>
                    <td style={styles.td}>{l.productid}</td>
                    <td style={styles.td}>
                      {l.products?.productname || `Producto #${l.productid}`}
                    </td>
                    <td style={styles.td}>{l.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
