import React from 'react';

export default function SummaryDashboard() {
  // Simulación de cálculo de ingresos aggregando campos: UnitPrice * Quantity * (1 - Discount)
  const stats = {
    totalSales: 'S/. 124,500.80',
    pendingOrders: 14,
    activeShippers: 3
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h2>📊 Panel de Control Administrativo (Cencosud / Metro)</h2>
      <p style={{ color: '#666' }}>Métricas calculadas en tiempo real de las órdenes de venta.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ background: '#0056b3', color: 'white', padding: '1.5rem', borderRadius: '6px', flex: 1 }}>
          <h3>Ingresos Totales</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.totalSales}</p>
        </div>
        <div style={{ background: '#28a745', color: 'white', padding: '1.5rem', borderRadius: '6px', flex: 1 }}>
          <h3>Pedidos por Despachar</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
}