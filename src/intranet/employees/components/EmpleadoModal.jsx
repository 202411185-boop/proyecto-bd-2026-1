import React, { useState, useEffect } from 'react';
import { COLORS } from '../styles';

const CAMPOS = [
  { key: 'lastname',        label: 'Apellido',            type: 'text',   required: true  },
  { key: 'firstname',       label: 'Primer nombre',       type: 'text',   required: true  },
  { key: 'title',           label: 'Título',              type: 'text',   required: false },
  { key: 'titleofcourtesy', label: 'Tratamiento',         type: 'text',   required: false },
  { key: 'birthdate',       label: 'Fecha de nacimiento', type: 'date',   required: false },
  { key: 'hiredate',        label: 'Fecha de contratación', type: 'date', required: false },
  { key: 'address',         label: 'Dirección',           type: 'text',   required: false },
  { key: 'city',            label: 'Ciudad',              type: 'text',   required: false },
  { key: 'region',          label: 'Región',              type: 'text',   required: false },
  { key: 'postalcode',      label: 'Código postal',       type: 'text',   required: false },
  { key: 'country',         label: 'País',                type: 'text',   required: false },
  { key: 'homephone',       label: 'Teléfono',            type: 'text',   required: false },
  { key: 'extension',       label: 'Extensión',           type: 'text',   required: false },
  { key: 'photo',           label: 'Foto (URL)',          type: 'text',   required: false },
  { key: 'notes',           label: 'Notas',               type: 'textarea', required: false },
  { key: 'reportsto',       label: 'Reporta a (ID empleado)', type: 'number', required: false },
];

const VACÍO = Object.fromEntries(CAMPOS.map(c => [c.key, '']));

function formatearParaInput(empleado) {
  const obj = { ...VACÍO };
  CAMPOS.forEach(({ key, type }) => {
    const val = empleado?.[key];
    if (val === null || val === undefined) {
      obj[key] = '';
    } else if (type === 'date' && val) {
      // Convierte "1968-12-08T05:00:00+00:00" → "1968-12-08"
      obj[key] = String(val).slice(0, 10);
    } else {
      obj[key] = String(val);
    }
  });
  return obj;
}

export default function EmpleadoModal({ modo, empleado, onGuardar, onCerrar, guardando }) {
  const esEdicion = modo === 'editar';
  const [form, setForm] = useState(VACÍO);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(esEdicion && empleado ? formatearParaInput(empleado) : { ...VACÍO });
    setErrores({});
  }, [empleado, esEdicion]);

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
    // Convierte vacíos a null y number a int
    const payload = {};
    CAMPOS.forEach(({ key, type }) => {
      const val = form[key].trim();
      if (val === '') {
        payload[key] = null;
      } else if (type === 'number') {
        payload[key] = parseInt(val, 10);
      } else {
        payload[key] = val;
      }
    });
    onGuardar(payload);
  };

  // Estilos inline del modal
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
      width: '90%', maxWidth: '600px',
      maxHeight: '88vh',
      overflowY: 'auto',
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
    cuerpo: { padding: '1.4rem' },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    grupoFull: { gridColumn: '1 / -1' },
    label: {
      display: 'block', fontSize: '0.78rem',
      fontWeight: 600, color: '#555',
      marginBottom: '0.3rem',
    },
    labelReq: { color: COLORS.delete },
    input: {
      width: '100%', boxSizing: 'border-box',
      padding: '0.5rem 0.7rem',
      borderRadius: '5px', fontSize: '0.88rem',
      border: '1px solid #ccc', outline: 'none',
      fontFamily: 'inherit',
    },
    inputError: { border: `1px solid ${COLORS.delete}` },
    textarea: {
      width: '100%', boxSizing: 'border-box',
      padding: '0.5rem 0.7rem',
      borderRadius: '5px', fontSize: '0.88rem',
      border: '1px solid #ccc', outline: 'none',
      fontFamily: 'inherit', resize: 'vertical',
      minHeight: '80px',
    },
    msgError: { color: COLORS.delete, fontSize: '0.72rem', marginTop: '0.2rem' },
    footer: {
      display: 'flex', justifyContent: 'flex-end', gap: '0.8rem',
      padding: '1rem 1.4rem',
      borderTop: '1px solid #eee',
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

  // Campos que ocupan toda la fila
  const camposFullRow = new Set(['address', 'notes', 'photo']);

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
      <div style={s.caja}>
        {/* Header */}
        <div style={s.header}>
          <h2 style={s.headerTitulo}>
            {esEdicion
              ? `✏️  Editar empleado #${empleado?.employeeid}`
              : '➕  Agregar nuevo empleado'}
          </h2>
          <button style={s.btnCerrar} onClick={onCerrar}>✕</button>
        </div>

        {/* Cuerpo */}
        <div style={s.cuerpo}>
          <div style={s.grid}>
            {CAMPOS.map(({ key, label, type, required }) => {
              const esFull = camposFullRow.has(key);
              return (
                <div key={key} style={esFull ? s.grupoFull : {}}>
                  <label style={s.label}>
                    {label}
                    {required && <span style={s.labelReq}> *</span>}
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      style={{ ...s.textarea, ...(errores[key] ? s.inputError : {}) }}
                      value={form[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder={label}
                    />
                  ) : (
                    <input
                      style={{ ...s.input, ...(errores[key] ? s.inputError : {}) }}
                      type={type}
                      value={form[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder={type !== 'date' ? label : ''}
                    />
                  )}
                  {errores[key] && <div style={s.msgError}>{errores[key]}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button style={s.btnCancelar} onClick={onCerrar} disabled={guardando}>
            Cancelar
          </button>
          <button style={s.btnGuardar} onClick={handleSubmit} disabled={guardando}>
            {guardando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Agregar empleado'}
          </button>
        </div>
      </div>
    </div>
  );
}
