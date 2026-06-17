import React from 'react';

export default function ShippersPage() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>📋 Despacho y Monitoreo de Pedidos</h2>
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', background: '#fff' }}>
        <h4>Orden #10248 (Cliente: VINET)</h4>
        <p><strong>Fecha de Orden:</strong> 2026-06-16</p>
        <p><strong>Dirección de Envío:</strong> Av. La Universidad 123 - Surco</p>
        <label><strong>Asignar Courier (Tabla Shippers): </strong></label>
        <select style={{ padding: '0.25rem', marginLeft: '0.5rem' }}>
          <option>Speedy Express (ID: 1)</option>
          <option>United Package (ID: 2)</option>
          <option>Federal Shipping (ID: 3)</option>
        </select>
        <button style={{ marginLeft: '1rem', background: '#333', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
          Actualizar Estado
        </button>
      </div>
    </div>
  );
}