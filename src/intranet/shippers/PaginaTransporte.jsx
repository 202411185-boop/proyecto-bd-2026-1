import React, { useState, useEffect } from 'react';
// Nota: Ajusta la ruta de importación según dónde tenga Favio el cliente de Supabase
import { supabase } from "../../supabase";

export default function PaginaTransporte() {
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modo, setModo] = useState('nuevo'); // 'nuevo' | 'editar'
  const [shipperIdEditar, setShipperIdEditar] = useState('');
  const [shipperName, setShipperName] = useState('');
  const [phone, setPhone] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  // 1. Cargar la lista (SELECT)
  async function cargarShippers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shippers')
        .select('*')
        .order('shipperid', { ascending: true });

      if (error) throw error;
      setShippers(data || []);
    } catch (error) {
      console.error('Error cargando shippers:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarShippers();
  }, []);

  function limpiarFormulario() {
    setShipperIdEditar('');
    setShipperName('');
    setPhone('');
    setMensaje('');
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    limpiarFormulario();
  }

  // Al elegir un shipper en modo "editar", precargamos sus datos
  function handleSeleccionarShipper(id) {
    setShipperIdEditar(id);
    const s = shippers.find(s => String(s.shipperid) === String(id));
    if (s) {
      setShipperName(s.shippername || '');
      setPhone(s.phone || '');
    } else {
      setShipperName('');
      setPhone('');
    }
  }

  // 2. Guardar (INSERT o UPDATE según el modo)
  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!shipperName || !phone) {
      setMensaje('❌ Por favor, completa todos los campos.');
      return;
    }

    if (phone.length > 15) {
      setMensaje(`❌ El teléfono no puede tener más de 15 caracteres (tiene ${phone.length}). Ej: (51)999666666`);
      return;
    }

    if (modo === 'editar' && !shipperIdEditar) {
      setMensaje('❌ Selecciona un transportista para editar.');
      return;
    }

    setGuardando(true);
    try {
      if (modo === 'editar') {
        const { error } = await supabase
          .from('shippers')
          .update({ shippername: shipperName, phone: phone })
          .eq('shipperid', Number(shipperIdEditar));

        if (error) throw error;
        setMensaje('✅ ¡Transportista actualizado exitosamente!');
      } else {
        // Calculamos el siguiente ID manualmente por si la secuencia
        // autoincremental de la tabla está desincronizada (causa errores
        // de "duplicate key value" al insertar)
        const { data: maxRow, error: errMax } = await supabase
          .from('shippers')
          .select('shipperid')
          .order('shipperid', { ascending: false })
          .limit(1)
          .single();

        if (errMax) throw errMax;

        const siguienteId = (maxRow?.shipperid || 0) + 1;

        const { error } = await supabase
          .from('shippers')
          .insert([{ shipperid: siguienteId, shippername: shipperName, phone: phone }]);

        if (error) throw error;
        setMensaje('✅ ¡Transportista registrado exitosamente!');
      }

      limpiarFormulario();
      setModo('nuevo');
      cargarShippers();
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Módulo de Shippers (Empresas de Transporte)</h2>

      {/* Formulario */}
      <div style={{ backgroundColor: '#fffde7', padding: '20px', borderRadius: '8px', border: '1px solid #fdd835', marginBottom: '30px', maxWidth: '500px' }}>
        <h3 style={{ marginTop: 0, color: '#f57f17' }}>🚚 {modo === 'editar' ? 'Editar Transportista' : 'Registrar Nuevo Transportista'}</h3>

        {/* Selector de modo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => cambiarModo('nuevo')}
            style={modo === 'nuevo' ? tabActivaStyle : tabInactivaStyle}
          >
            Nuevo
          </button>
          <button
            type="button"
            onClick={() => cambiarModo('editar')}
            style={modo === 'editar' ? tabActivaStyle : tabInactivaStyle}
          >
            Editar existente
          </button>
        </div>

        <form onSubmit={handleGuardar}>
          {modo === 'editar' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Transportista:</label>
              <select
                value={shipperIdEditar}
                onChange={(e) => handleSeleccionarShipper(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">-- Selecciona un transportista --</option>
                {shippers.map((s) => (
                  <option key={s.shipperid} value={s.shipperid}>{s.shippername}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la Empresa:</label>
            <input type="text" value={shipperName} onChange={(e) => setShipperName(e.target.value)} placeholder="Ej. Speedy Express" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Teléfono:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={15}
              placeholder="Ej. (503)5559831"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <small style={{ color: phone.length > 15 ? '#c62828' : '#888' }}>{phone.length}/15 caracteres</small>
          </div>
          <button type="submit" disabled={guardando} style={{ backgroundColor: '#fdd835', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            {guardando ? 'Guardando...' : (modo === 'editar' ? 'Guardar Cambios' : 'Guardar en Base de Datos')}
          </button>
        </form>
        {mensaje && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{mensaje}</p>}
      </div>

      {/* Tabla */}
      <h3 style={{ color: '#333' }}>📋 Lista de Transportistas</h3>
      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', maxWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nombre</th>
              <th style={{ padding: '12px' }}>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {shippers.map((item) => (
              <tr key={item.shipperid} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{item.shipperid}</td>
                <td style={{ padding: '12px' }}>{item.shippername}</td>
                <td style={{ padding: '12px' }}>{item.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tabBaseStyle = {
  flex: 1,
  padding: '8px 10px',
  borderRadius: '4px',
  border: '1px solid #f57f17',
  fontWeight: 'bold',
  fontSize: '13px',
  cursor: 'pointer'
};

const tabActivaStyle = {
  ...tabBaseStyle,
  backgroundColor: '#f57f17',
  color: '#fff'
};

const tabInactivaStyle = {
  ...tabBaseStyle,
  backgroundColor: '#fff',
  color: '#f57f17'
};
