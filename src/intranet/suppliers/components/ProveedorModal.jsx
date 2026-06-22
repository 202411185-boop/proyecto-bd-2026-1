import React, { useState, useEffect } from 'react';
import { COLORS } from '../styles';

const CAMPOS = [
  { key: 'suppliername', label: 'Nombre del proveedor', type: 'text', required: true  },
  { key: 'contactname',  label: 'Nombre de contacto',   type: 'text', required: false },
  { key: 'address',      label: 'Dirección',             type: 'text', required: false },
  { key: 'city',         label: 'Ciudad',                type: 'text', required: false },
  { key: 'postalcode',   label: 'Código postal',         type: 'text', required: false },
  { key: 'country',      label: 'País',                  type: 'text', required: false },
  { key: 'phone',        label: 'Teléfono',              type: 'text', required: false },
];

const VACÍO = Object.fromEntries(CAMPOS.map(c => [c.key, '']));

function formatearParaInput(proveedor) {
  const obj = { ...VACÍO };
  CAMPOS.forEach(({ key }) => {
    const val = proveedor?.[key];
    obj[key] = (val === null || val === undefined) ? '' : String(val);
  });
  return obj;
}

export default function ProveedorModal({ modo, proveedor, onGuardar, onCerrar, guardando }) {
  const esEdicion = modo === 'editar';
  const [form, setForm] = useState(VACÍO);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(esEdicion && proveedor ? formatearParaInput(proveedor) : { ...VACÍO });
    setErrores({});
  }, [proveedor, esEdicion]);

  const handleChange = (key, valor) => {
    setForm(prev => ({ ...prev, [key]: valor }));
    if (errores[key]) setErrores(prev => ({ ...prev, [key]: null }));
  };

  const validar = () => {
    const nuevosErrores = {};
    CAMPOS.filter(c => c.required).forEach(c => {
      if (!form[c.key].trim()) nuevosErrores[c.key] = 'Este campo es obligatorio';
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    const payload = {};
    CAMPOS.forEach(({ key }) => {
      const val = form[key].trim();
      payload[key] = val === '' ? null : val;
    });
    onGuardar(payload);
  };

  const s = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 2000,
    },
    caja: {
      background: '#fff',
      borderRadius: '10px',
      width: '90%', maxWidth: '520px',
      boxShadow: '0 6px 28px rgba(0,0,0,0.3)',
      fontFamily: "'Segoe UI', Arial, sans-serif",
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 1.4rem',
      background: COLORS.tableHeader,
      borderRadius: '10px 10px 0 0',
    },
    headerTitulo: { color: '#fff', fontWeight: 800, fontSize: '1.1rem', margin: 0 },
    btnCerrar: {
      background: 'transparent', border: '2px solid #fff',
      color: '#fff', borderRadius: '5px',
      padding: '0.25rem 0.7rem', cursor: 'pointer',
      fontWeight: 700, fontSize: '1rem',
    },
    cuerpo: { padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
    label: { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' },
    labelReq: { color: COLORS.delete },
    input: {
      width: '100%', boxSizing: 'border-box',
      padding: '0.5rem 0.7rem', borderRadius: '5px',
      fontSize: '0.88rem', border: '1px solid #ccc',
      outline: 'none', fontFamily: 'inherit',
    },
    inputError: { border: `1px solid ${COLORS.delete}` },
    msgError: { color: COLORS.delete, fontSize: '0.72rem', marginTop: '0.2rem' },
    footer: {
      display: 'flex', justifyContent: 'flex-end', gap: '0.8rem',
      padding: '1rem 1.4rem', borderTop: '1px solid #eee',
    },
    btnCancelar: {
      background: '#888', color: '#fff', border: 'none',
      borderRadius: '6px', padding: '0.55rem 1.3rem',
      fontWeight: 700, cursor: 'pointer',
    },
    btnGuardar: {
      background: esEdicion ? COLORS.edit : COLORS.green,
      color: '#fff', border: 'none',
      borderRadius: '6px', padding: '0.55rem 1.3rem',
      fontWeight: 700, cursor: guardando ? 'not-allowed' : 'pointer',
      opacity: guardando ? 0.7 : 1,
    },
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div style={s.caja}>
        <div style={s.header}>
          <h2 style={s.headerTitulo}>
            {esEdicion
              ? `✏️  Editar proveedor #${proveedor?.supplierid}`
              : '➕  Agregar nuevo proveedor'}
          </h2>
          <button style={s.btnCerrar} onClick={onCerrar}>✕</button>
        </div>

        <div style={s.cuerpo}>
          {CAMPOS.map(({ key, label, type, required }) => (
            <div key={key}>
              <label style={s.label}>
                {label}
                {required && <span style={s.labelReq}> *</span>}
              </label>
              <input
                style={{ ...s.input, ...(errores[key] ? s.inputError : {}) }}
                type={type}
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={label}
              />
              {errores[key] && <div style={s.msgError}>{errores[key]}</div>}
            </div>
          ))}
        </div>

        <div style={s.footer}>
          <button style={s.btnCancelar} onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button style={s.btnGuardar} onClick={handleSubmit} disabled={guardando}>
            {guardando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Agregar proveedor'}
          </button>
        </div>
      </div>
    </div>
  );
}
