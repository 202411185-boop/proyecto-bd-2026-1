import React from 'react';

export default function CheckoutPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Tu Carrito de Compras</h2>
      <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem' }}>
        <p><strong>Resumen del pedido:</strong> Tu carrito está listo para procesar.</p>
        <p><small>Al dar click en comprar, se generará una fila en la tabla Orders y múltiples en Order Details.</small></p>
      </div>
      <button style={{ background: 'green', color: 'white', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
        Confirmar Orden de Compra
      </button>
    </div>
  );
}