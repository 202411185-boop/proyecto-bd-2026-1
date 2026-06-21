import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [customerId, setCustomerId] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Intentando conectar con CustomerID de Northwind:", customerId);
    // Aquí irá tu fetch al backend (ej. SELECT * FROM Customers WHERE CustomerID = customerId)
  
    // Redirección directa a la intranet
    navigate('/intranet');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2> Iniciar Sesión - Retail</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Código de Usuario</label>
          <input 
            type="text" 
            value={customerId} 
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Ej. ALFKI" 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ background: '#fc0', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', width: '100%' }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}