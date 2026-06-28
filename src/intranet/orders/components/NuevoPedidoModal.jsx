import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { COLORS, styles } from '../styles';

// ───────────────────────────────────────────────
// NuevoPedidoModal
// Formulario para crear un pedido completo.
// Los 4 campos de ID se reemplazan por dropdowns
// que cargan datos reales desde Supabase:
//   - customerid  → customername
//   - employeeid  → lastname
//   - shipperid   → shippername
//   - productid   → productname (por cada línea)
// ───────────────────────────────────────────────

const CAMPO_VACIO = { productid: '', quantity: '' };

export default function NuevoPedidoModal({ onCerrar, handleCrearPedido }) {
  // ── Listas para los dropdowns ──────────────────────────────────────────
  const [clientes,      setClientes]      = useState([]);
  const [empleados,     setEmpleados]     = useState([]);
  const [transportistas,setTransportistas]= useState([]);
  const [productos,     setProductos]     = useState([]);
  const [loadingListas, setLoadingListas] = useState(true);

  // ── Valores seleccionados de cabecera ──────────────────────────────────
  const [customerid, setCustomerid] = useState('');
  const [employeeid, setEmployeeid] = useState('');
  const [shipperid,  setShipperid]  = useState('');
  const [orderdate,  setOrderdate]  = useState('');

  // ── Líneas de detalle ──────────────────────────────────────────────────
  const [detalles, setDetalles] = useState([{ ...CAMPO_VACIO }]);

  const [guardando, setGuardando] = useState(false);
  const [errorMsg,  setErrorMsg]  = useState('');

  // ── Cargar los 4 catálogos al montar ──────────────────────────────────
  useEffect(() => {
    async function cargarCatalogos() {
      setLoadingListas(true);
      const [resClientes, resEmpleados, resTransportistas, resProductos] = await Promise.all([
        supabase
          .from('customers')
          .select('customerid, customername')
          .order('customername', { ascending: true }),
        supabase
          .from('employees')
          .select('employeeid, lastname, firstname')
          .order('lastname', { ascending: true }),
        supabase
          .from('shippers')
          .select('shipperid, shippername')
          .order('shippername', { ascending: true }),
        supabase
          .from('products')
          .select('productid, productname')
          .order('productname', { ascending: true }),
      ]);

      if (!resClientes.error)      setClientes(resClientes.data || []);
      if (!resEmpleados.error)     setEmpleados(resEmpleados.data || []);
      if (!resTransportistas.error)setTransportistas(resTransportistas.data || []);
      if (!resProductos.error)     setProductos(resProductos.data || []);

      setLoadingListas(false);
    }
    cargarCatalogos();
  }, []);

  // ── Manejo de filas de detalle ─────────────────────────────────────────
  const actualizarDetalle = (idx, campo, valor) =>
    setDetalles((prev) => prev.map((d, i) => (i === idx ? { ...d, [campo]: valor } : d)));

  const agregarFila = () => setDetalles((prev) => [...prev, { ...CAMPO_VACIO }]);

  const eliminarFila = (idx) => {
    if (detalles.length === 1) return;
    setDetalles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Validación y envío ─────────────────────────────────────────────────
  const handleGuardar = async () => {
    setErrorMsg('');

    if (!customerid) { setErrorMsg('Debes seleccionar un cliente.'); return; }

    for (let i = 0; i < detalles.length; i++) {
      const { productid, quantity } = detalles[i];
      if (!productid) { setErrorMsg(`Línea ${i + 1}: debes seleccionar un producto.`); return; }
      if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        setErrorMsg(`Línea ${i + 1}: la cantidad debe ser un número mayor a 0.`); return;
      }
    }

    const payload = {
      customerid: Number(customerid),
      employeeid: employeeid ? Number(employeeid) : null,
      shipperid:  shipperid  ? Number(shipperid)  : null,
      orderdate:  orderdate  || null,
      detalles: detalles.map((d) => ({
        productid: Number(d.productid),
        quantity:  Number(d.quantity),
      })),
    };

    try {
      setGuardando(true);
      await handleCrearPedido(payload);
      alert('✅ Pedido registrado correctamente.');
      onCerrar();
    } catch (err) {
      setErrorMsg(err.message || 'Error al registrar el pedido.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  if (loadingListas) {
    return (
      <div style={styles.overlay}>
        <div style={{ ...styles.modal, textAlign: 'center', padding: '2.5rem' }}>
          <p style={{ color: COLORS.text, fontSize: '1rem' }}>Cargando catálogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <div
        style={{ ...styles.modal, width: '620px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={styles.modalTitulo}>Nuevo Pedido</h2>
          <button style={styles.botonEliminar} onClick={onCerrar}>Salir</button>
        </div>

        {errorMsg && <p style={styles.errorTexto}>⚠ {errorMsg}</p>}

        {/* ── Cabecera: 2 columnas ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>

          {/* Cliente */}
          <div style={styles.campo}>
            <label style={styles.label}>Cliente *</label>
            <select
              style={styles.select}
              value={customerid}
              onChange={(e) => setCustomerid(e.target.value)}
            >
              <option value="">— Selecciona un cliente —</option>
              {clientes.map((c) => (
                <option key={c.customerid} value={c.customerid}>
                  {c.customername}
                </option>
              ))}
            </select>
          </div>

          {/* Empleado */}
          <div style={styles.campo}>
            <label style={styles.label}>Empleado</label>
            <select
              style={styles.select}
              value={employeeid}
              onChange={(e) => setEmployeeid(e.target.value)}
            >
              <option value="">— Selecciona un empleado —</option>
              {empleados.map((e) => (
                <option key={e.employeeid} value={e.employeeid}>
                  {e.lastname}, {e.firstname}
                </option>
              ))}
            </select>
          </div>

          {/* Transportista */}
          <div style={styles.campo}>
            <label style={styles.label}>Transportista</label>
            <select
              style={styles.select}
              value={shipperid}
              onChange={(e) => setShipperid(e.target.value)}
            >
              <option value="">— Selecciona un transportista —</option>
              {transportistas.map((t) => (
                <option key={t.shipperid} value={t.shipperid}>
                  {t.shippername}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div style={styles.campo}>
            <label style={styles.label}>Fecha del Pedido</label>
            <input
              style={styles.input}
              type="date"
              value={orderdate}
              onChange={(e) => setOrderdate(e.target.value)}
            />
          </div>
        </div>

        {/* ── Líneas de producto ── */}
        <div style={{ marginBottom: '0.8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ ...styles.label, fontSize: '0.9rem' }}>Productos *</span>
            <button
              style={{ ...styles.botonGuardar, padding: '0.3rem 0.8rem', fontSize: '0.78rem' }}
              onClick={agregarFila}
            >
              + Agregar producto
            </button>
          </div>

          {detalles.map((d, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {/* Dropdown de producto */}
              <select
                style={{ ...styles.select, flex: 3 }}
                value={d.productid}
                onChange={(e) => actualizarDetalle(idx, 'productid', e.target.value)}
              >
                <option value="">— Selecciona un producto —</option>
                {productos.map((p) => (
                  <option key={p.productid} value={p.productid}>
                    {p.productname}
                  </option>
                ))}
              </select>

              {/* Cantidad */}
              <input
                style={{ ...styles.input, flex: 1, minWidth: '70px' }}
                type="number"
                min="1"
                placeholder="Cant."
                value={d.quantity}
                onChange={(e) => actualizarDetalle(idx, 'quantity', e.target.value)}
              />

              {/* Eliminar fila */}
              <button
                style={{
                  ...styles.botonEliminar,
                  padding: '0.4rem 0.7rem',
                  opacity: detalles.length === 1 ? 0.4 : 1,
                  cursor: detalles.length === 1 ? 'not-allowed' : 'pointer',
                }}
                onClick={() => eliminarFila(idx)}
                disabled={detalles.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ── Botones principales ── */}
        <div style={styles.accionesModal}>
          <button style={styles.botonCancelar} onClick={onCerrar}>Cancelar</button>
          <button
            style={{ ...styles.botonGuardar, opacity: guardando ? 0.6 : 1 }}
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Registrar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}
