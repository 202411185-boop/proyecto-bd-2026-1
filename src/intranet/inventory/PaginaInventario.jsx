import React, { useState } from 'react';

export default function InventoryPage() {
  // Simulación de filas de la tabla dbo.Products
  const [products, setProducts] = useState([
    { ProductID: 1, ProductName: 'Televisor Smart 55"', UnitPrice: 1899.00, UnitsInStock: 45 },
    { ProductID: 2, ProductName: 'Arroz Integral 1kg', UnitPrice: 4.50, UnitsInStock: 250 }
  ]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>📦 Control de Inventario General (WMS)</h2>
      <p>Gestión directa de la tabla <code>Products</code>.</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>ID</th>
            <th style={{ padding: '0.5rem' }}>Producto</th>
            <th style={{ padding: '0.5rem' }}>Precio Unitario</th>
            <th style={{ padding: '0.5rem' }}>Stock Actual</th>
            <th style={{ padding: '0.5rem' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ProductID} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{p.ProductID}</td>
              <td style={{ padding: '0.5rem' }}>{p.ProductName}</td>
              <td style={{ padding: '0.5rem' }}>S/. {p.UnitPrice.toFixed(2)}</td>
              <td style={{ padding: '0.5rem' }}>{p.UnitsInStock} u.</td>
              <td style={{ padding: '0.5rem' }}>
                <button style={{ marginRight: '5px' }}>Editar</button>
                <button style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}