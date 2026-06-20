import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import { useOrderFormOptions } from '../hooks/useOrderFormOptions';

const ORDEN_VACIA = {
  customerid: '',
  employeeid: '',
  orderdate: '',
  shipperid: '',
};

export default function OrderFormModal({ orden, onGuardar, onCerrar }) {
  const { clientes, empleados, transportistas, loadingOpciones } = useOrderFormOptions();
  const [form, setForm] = useState(ORDEN_VACIA);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const esEdicion = Boolean(orden);

  useEffect(() => {
    if (orden) {
      setForm({
        customerid: orden.customerid ?? '',
        employeeid: orden.employeeid ?? '',
        orderdate: orden.orderdate ? orden.orderdate.slice(0, 10) : '',
        shipperid: orden.shipperid ?? '',
      });
    } else {
      setForm(ORDEN_VACIA);
    }
  }, [orden]);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.customerid || !form.employeeid || !form.orderdate || !form.shipperid) {
      setError('Completa todos los campos antes de guardar.');
      return;
    }

    setGuardando(true);
    try {
      await onGuardar({
        customerid: form.customerid,
        employeeid: Number(form.employeeid),
        orderdate: form.orderdate,
        shipperid: Number(form.shipperid),
      });
      onCerrar();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la orden.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onCerrar}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.modalTitulo}>
          {esEdicion ? `Editar orden #${orden.orderid}` : 'Agregar orden'}
        </h2>

        {error && <p style={styles.errorTexto}>{error}</p>}

        {loadingOpciones ? (
          <p>Cargando opciones...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.campo}>
              <label style={styles.label}>Cliente</label>
              <select
                style={styles.select}
                value={form.customerid}
                onChange={handleChange('customerid')}
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c.customerid} value={c.customerid}>
                    {c.companyname}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Personal</label>
              <select
                style={styles.select}
                value={form.employeeid}
                onChange={handleChange('employeeid')}
              >
                <option value="">Selecciona un empleado</option>
                {empleados.map((e) => (
                  <option key={e.employeeid} value={e.employeeid}>
                    {e.firstname} {e.lastname}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Fecha de orden</label>
              <input
                type="date"
                style={styles.input}
                value={form.orderdate}
                onChange={handleChange('orderdate')}
              />
            </div>

            <div style={styles.campo}>
              <label style={styles.label}>Transporte</label>
              <select
                style={styles.select}
                value={form.shipperid}
                onChange={handleChange('shipperid')}
              >
                <option value="">Selecciona un transportista</option>
                {transportistas.map((t) => (
                  <option key={t.shipperid} value={t.shipperid}>
                    {t.companyname}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.accionesModal}>
              <button type="button" style={styles.botonCancelar} onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" style={styles.botonGuardar} disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
