import React from 'react';

export default function EmployeesPage() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>👥 Fichas del Personal y Fuerza de Ventas</h2>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', width: '250px', borderRadius: '4px' }}>
          <strong>Davolio, Nancy</strong>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#555' }}>Cargo: Representante de Ventas</p>
          <p style={{ fontSize: '0.8rem', background: '#f0f0f0', padding: '0.2rem', display: 'inline-block' }}>
             Territorio: Lima Centro (ID: 02116)
          </p>
        </div>
      </div>
    </div>
  );
}