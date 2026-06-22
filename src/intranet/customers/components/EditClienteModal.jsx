import React, { useState, useEffect } from 'react';
import { COLORS } from '../styles';

// ───────────────────────────────────────────────────────────
// EditClienteModal
// Pop-up que permite al admin editar "address" y "city"
// de un cliente. Se abre desde el botón "editar" de la tabla.
//
// Props:
//   cliente     → objeto cliente completo (el registro a editar)
//   onGuardar   → fn(customerid, { address, city }) — llama al hook
//   onCerrar    → fn() — cierra el modal sin guardar
// ───────────────────────────────────────────────────────────

export default function EditClienteModal({ cliente, onGuardar, onCerrar }) {
  const [address, setAddress] = useState('');
  const [city, setCity]       = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');

  // Pre-cargar los valores actuales del cliente al abrir el modal
  useEffect(() => {
    if (cliente) {
      setAddress(cliente.address || '');
      setCity(cliente.city || '');
      setErrorLocal('');
    }
  }, [cliente]);

  if (!cliente) return null;

  const handleSubmit = async () => {
    if (!address.trim()) {
      setErrorLocal('La dirección no puede estar vacía.');
      return;
    }
    if (!city.trim()) {
      setErrorLocal('La ciudad no puede estar vacía.');
      return;
    }
    setGuardando(true);
    setErrorLocal('');
    const ok = await onGuardar(cliente.customerid, {
      address: address.trim(),
      city: city.trim(),
    });
    setGuardando(false);
    if (ok) onCerrar(); // Solo cierra si guardó correctamente
  };

  // ── Estilos inline ──────────────────────────────────────
  const overlay = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  };

  const caja = {
    backgroundColor: '#fffdf4',
    borderRadius: '10px',
    padding: '2rem',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: 'relative',
  };

  const titulo = {
    margin: '0 0 0.3rem 0',
    fontSize: '1.2rem',
    fontWeight: 800,
    color: COLORS.tableHeader,
  };

  const subtitulo = {
    margin: '0 0 1.4rem 0',
    fontSize: '0.85rem',
    color: '#8A7A50',
  };

  const label = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: '0.3rem',
  };

  const input = {
    width: '100%',
    padding: '0.55rem 0.8rem',
    borderRadius: '6px',
    border: `1.5px solid ${COLORS.tableHeader}`,
    fontSize: '0.9rem',
    marginBottom: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    color: COLORS.text,
    backgroundColor: '#FEFAE8',
  };

  const fila = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  };

  const btnGuardar = {
    background: COLORS.green,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.55rem 1.4rem',
    fontWeight: 700,
    cursor: guardando ? 'not-allowed' : 'pointer',
    opacity: guardando ? 0.7 : 1,
    fontSize: '0.9rem',
  };

  const btnCancelar = {
    background: '#bbb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.55rem 1.2rem',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  const errorStyle = {
    color: COLORS.delete,
    fontSize: '0.82rem',
    marginBottom: '0.8rem',
    fontWeight: 600,
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div style={caja}>
        {/* Cabecera */}
        <p style={titulo}>✏️ Editar Cliente</p>
        <p style={subtitulo}>
          <strong>{cliente.customername}</strong> — ID {cliente.customerid}
        </p>

        {/* Campo dirección */}
        <label style={label} htmlFor="edit-address">Dirección</label>
        <input
          id="edit-address"
          style={input}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej: Av. Javier Prado 123"
          disabled={guardando}
        />

        {/* Campo ciudad */}
        <label style={label} htmlFor="edit-city">Ciudad</label>
        <input
          id="edit-city"
          style={input}
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ej: Lima"
          disabled={guardando}
        />

        {/* Error local */}
        {errorLocal && <p style={errorStyle}>⚠ {errorLocal}</p>}

        {/* Botones */}
        <div style={fila}>
          <button style={btnCancelar} onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button style={btnGuardar} onClick={handleSubmit} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
