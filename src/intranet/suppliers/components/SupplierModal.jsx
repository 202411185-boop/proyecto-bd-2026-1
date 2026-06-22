import React, { useState, useEffect } from 'react';

const CAMPOS_VACIOS = {
  suppliername: '',
  contactname: '',
  address: '',
  city: '',
  postalcode: '',
  country: '',
  phone: '',
};

export default function SupplierModal({ proveedor, onGuardar, onCerrar }) {
  const esEdicion = Boolean(proveedor);
  const [campos, setCampos] = useState(CAMPOS_VACIOS);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (proveedor) {
      setCampos({
        suppliername: proveedor.suppliername || '',
        contactname: proveedor.contactname || '',
        address: proveedor.address || '',
        city: proveedor.city || '',
        postalcode: proveedor.postalcode || '',
        country: proveedor.country || '',
        phone: proveedor.phone || '',
      });
    } else {
      setCampos(CAMPOS_VACIOS);
    }
    setErrorMsg(null);
  }, [proveedor]);

  function actualizarCampo(nombre, valor) {
    setCampos((prev) => ({ ...prev, [nombre]: valor }));
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCerrar();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg(null);

    if (!campos.suppliername.trim()) {
      setErrorMsg('El nombre del proveedor es obligatorio.');
      return;
    }

    setGuardando(true);
    const resultado = await onGuardar({
      ...campos,
      supplierid: esEdicion ? proveedor.supplierid : undefined,
    });
    setGuardando(false);

    if (!resultado.ok) {
      setErrorMsg(resultado.message || 'Error al guardar el proveedor.');
      return;
    }

    onCerrar();
  }

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={boxStyle}>
        <h3 style={titleStyle}>{esEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}</h3>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Nombre del proveedor</label>
          <input
            type="text"
            value={campos.suppliername}
            onChange={(e) => actualizarCampo('suppliername', e.target.value)}
            style={inputStyle}
            placeholder="Ej: Exotic Liquid"
          />

          <label style={labelStyle}>Nombre de contacto</label>
          <input
            type="text"
            value={campos.contactname}
            onChange={(e) => actualizarCampo('contactname', e.target.value)}
            style={inputStyle}
            placeholder="Ej: Charlotte Cooper"
          />

          <label style={labelStyle}>Dirección</label>
          <input
            type="text"
            value={campos.address}
            onChange={(e) => actualizarCampo('address', e.target.value)}
            style={inputStyle}
            placeholder="Ej: 49 Gilbert St."
          />

          <div style={filaDosColumnas}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Ciudad</label>
              <input
                type="text"
                value={campos.city}
                onChange={(e) => actualizarCampo('city', e.target.value)}
                style={inputStyle}
                placeholder="Ej: London"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Código postal</label>
              <input
                type="text"
                value={campos.postalcode}
                onChange={(e) => actualizarCampo('postalcode', e.target.value)}
                style={inputStyle}
                placeholder="Ej: EC1 4SD"
              />
            </div>
          </div>

          <div style={filaDosColumnas}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>País</label>
              <input
                type="text"
                value={campos.country}
                onChange={(e) => actualizarCampo('country', e.target.value)}
                style={inputStyle}
                placeholder="Ej: UK"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Teléfono</label>
              <input
                type="text"
                value={campos.phone}
                onChange={(e) => actualizarCampo('phone', e.target.value)}
                style={inputStyle}
                placeholder="Ej: (171) 555-2222"
              />
            </div>
          </div>

          {errorMsg && <p style={errorStyle}>{errorMsg}</p>}

          <div style={botonesStyle}>
            <button type="button" onClick={onCerrar} style={botonCancelar}>
              Cancelar
            </button>
            <button type="submit" disabled={guardando} style={botonGuardar}>
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const boxStyle = {
  backgroundColor: '#fff',
  border: '2px solid #4caf50',
  borderRadius: '12px',
  padding: '28px',
  width: '440px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  fontFamily: 'Arial, sans-serif',
};

const titleStyle = {
  color: '#2e7d32',
  marginTop: 0,
  marginBottom: '18px',
  fontSize: '22px',
  fontWeight: 'bold',
};

const labelStyle = {
  display: 'block',
  fontWeight: 'bold',
  marginBottom: '6px',
  marginTop: '12px',
  color: '#333',
  fontSize: '13px',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
  fontSize: '14px',
};

const filaDosColumnas = {
  display: 'flex',
  gap: '12px',
};

const errorStyle = {
  marginTop: '14px',
  color: '#b71c1c',
  fontWeight: 'bold',
  fontSize: '13px',
};

const botonesStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '22px',
};

const botonCancelar = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#9e9e9e',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const botonGuardar = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#43a047',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
};
