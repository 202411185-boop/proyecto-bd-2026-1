import React, { useState, useEffect } from 'react';
// Nota: Ajusta la ruta de importación según dónde tenga Favio el cliente de Supabase
import { supabase } from '../../../lib/supabaseClient'; 

export default function PaginaTransporte() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el formulario de inserción
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [mensaje, setMensaje] = useState('');

  // 1. Cargar la lista de transportistas de la base de datos
  async function cargarShippers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Shippers')
        .select('*')
        .order('shipperid', { ascending: true });

      if (error) throw error;
      setShippers(data || []);
    } catch (error) {
      console.error('Error cargando Shippers:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarShippers();
  }, []);

  // 2. Registrar un nuevo transportista (Cumple con requisito de Inserciones del PDF)
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!companyName || !phone) {
      setMensaje('❌ Por favor, completa todos los campos.');
      return;
    }

    try {
      const { error } = await supabase
        .from('Shippers')
        .insert([{ shippername: companyName, phone: phone }]); // Nota: Ajusta si en su base está en minúsculas o tipo 'CompanyName'

      if (error) throw error;

      setMensaje('✅ ¡Transportista registrado exitosamente!');
      setCompanyName('');
      setPhone('');
      
      // Recargar la tabla automáticamente para ver el nuevo registro
      cargarShippers();
    } catch (error) {
      setMensaje(`❌ Error al insertar: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Módulo de Shippers (Empresas de Transporte)</h2>
      <p style={{ color: '#666' }}>Gestión de entidades encargadas de la distribución de pedidos.</p>

      {/* Formulario para Insertar Nuevo Registro */}
      <div style={{ 
        backgroundColor: '#fffde7', // Color temático Metro/Amarillo claro solicitado
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #fdd835',
        marginBottom: '30px',
        maxWidth: '500px'
      }}>
        <h3 style={{ marginTop: 0, color: '#f57f17' }}>🚚 Registrar Nuevo Transportista</h3>
        <form onSubmit={handleGuardar}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la Empresa:</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="Ej. Metro Envíos S.A."
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono de Contacto:</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Ej. (503) 555-1234"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#fdd835', 
              color: '#000', 
              border: 'none', 
              padding: '10px 15px', 
              borderRadius: '4px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Guardar en Base de Datos
          </button>
        </form>
        {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
      </div>

      {/* Tabla que lista los transportistas existentes */}
      <h3 style={{ color: '#333' }}>📋 Lista de Transportistas Registrados</h3>
      {loading ? (
        <p>Conectando con Supabase...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', maxWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nombre de la Empresa</th>
              <th style={{ padding: '12px' }}>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {shippers.map((item) => (
              <tr key={item.shipperid} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{item.shipperid}</td>
                {/* Nota: si los nombres en el Supabase de Favio están en mayúsculas, cámbialos a item.CompanyName o item.Phone */}
                <td style={{ padding: '12px' }}>{item.shippername || item.companyname}</td>
                <td style={{ padding: '12px' }}>{item.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}