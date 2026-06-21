import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación

  
  export default function StoreHomePage() {
  const navigate = useNavigate(); // 2. Inicializamos la función navigate
  
  // Simulación de datos traídos desde la tabla Products y Categories de Northwind
  const mockProducts = [
    { ProductID: 1, ProductName: 'Chais', UnitPrice: 18.00, UnitsInStock: 39 },
    { ProductID: 2, ProductName: 'Chang', UnitPrice: 19.00, UnitsInStock: 17 },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ background: '#fc0', padding: '1rem', marginBottom: '2rem' }}>
        <h1>🛒 Metro - Catálogo Virtual</h1>
        
        {/*BOTÓN QUE CONECTA CON EL LOGIN */}
        <button 
          onClick={() => navigate('/login')} // <-- Asegúrate de que '/login' coincida con la ruta en tu AppRoutes
          style={{ 
            background: '#333', 
            color: '#fff', 
            border: 'none', 
            padding: '0.6rem 1.2rem', 
            cursor: 'pointer', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Iniciar Sesión
        </button>

      </header>
      
      <main>
        <h3>Productos Disponibles (Tabla Northwind.Products)</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {mockProducts.map((prod) => (
            <div key={prod.ProductID} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', minWidth: '200px' }}>
              <h4>{prod.ProductName}</h4>
              <p>Precio: S/. {prod.UnitPrice.toFixed(2)}</p>
              <p><small>Stock disponible: {prod.UnitsInStock}</small></p>
              <button style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem', cursor: 'pointer', width: '100%' }}>
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}