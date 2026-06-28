import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

export function useOrders() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState(null);

  const totalPaginas = Math.max(1, Math.ceil(totalFilas / PAGE_SIZE));

  const cargarOrdenes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = pagina * PAGE_SIZE;
    const hasta = desde + PAGE_SIZE - 1;

    let query = supabase
      .from('orders')
      .select(
        `orderid, customerid, employeeid, orderdate, shipperid,
         customers ( customername )`,
        { count: 'exact' }
      )
      .order('orderid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      const texto = busqueda.trim();
      query = !Number.isNaN(Number(texto))
        ? query.eq('customerid', Number(texto))
        : query.eq('customerid', -1);
    }

    const { data, error, count } = await query;
    if (error) {
      setError(error.message);
      setOrdenes([]);
    } else {
      setOrdenes(data || []);
      setTotalFilas(count || 0);
    }
    setLoading(false);
  }, [pagina, busqueda]);

  useEffect(() => { cargarOrdenes(); }, [cargarOrdenes]);

  const handleBuscar = (texto) => { setBusqueda(texto); setPagina(0); };

  // ── SP 1: sp_registrar_pedido (ahora es FUNCTION, no PROCEDURE) ──────────
  // Los parámetros se pasan con el nombre exacto declarado en el SQL,
  // en el mismo orden. Supabase los mapea por nombre, no por posición.
  const handleCrearPedido = async ({ customerid, employeeid, shipperid, orderdate, detalles }) => {
    const { data, error } = await supabase.rpc('sp_registrar_pedido', {
      p_customerid: Number(customerid),
      p_employeeid: employeeid ? Number(employeeid) : null,
      p_orderdate:  orderdate ? new Date(orderdate).toISOString() : new Date().toISOString(),
      p_shipperid:  shipperid ? Number(shipperid) : null,
      p_productos:  detalles,
    });

    if (error) throw new Error(error.message);

    await cargarOrdenes();
    return data; // retorna el nuevo orderid
  };

  // ── SP 2: sp_GetCustomerOrderHistory ────────────────────────────────────
  // Supabase normaliza el nombre a minúsculas en el schema cache.
  const handleVerHistorial = useCallback(async (customerid) => {
    setLoadingHistorial(true);
    setErrorHistorial(null);
    setHistorial([]);

    const { data, error } = await supabase.rpc('sp_getcustomerorderhistory', {
      p_customerid: Number(customerid),
    });

    if (error) {
      setErrorHistorial(error.message);
    } else {
      setHistorial(data || []);
    }
    setLoadingHistorial(false);
  }, []);

  const limpiarHistorial = () => { setHistorial([]); setErrorHistorial(null); };

  // ── Eliminar pedido en cascada ───────────────────────────────────────────
  const handleEliminar = async (orderid) => {
    const confirmar = window.confirm(
      `¿Eliminar la orden #${orderid}? Esto también eliminará todos los ` +
      `productos asociados. Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error: errorDetalles } = await supabase
      .from('orderdetails').delete().eq('orderid', orderid);
    if (errorDetalles) { alert(`Error al eliminar detalle: ${errorDetalles.message}`); return; }

    const { error } = await supabase.from('orders').delete().eq('orderid', orderid);
    if (error) { alert(`Error al eliminar orden: ${error.message}`); return; }

    ordenes.length === 1 && pagina > 0 ? setPagina((p) => p - 1) : cargarOrdenes();
  };

  return {
    ordenes, loading, error,
    busqueda, pagina, totalPaginas,
    setPagina, handleBuscar, handleEliminar,
    handleCrearPedido,
    handleVerHistorial, limpiarHistorial,
    historial, loadingHistorial, errorHistorial,
    recargar: cargarOrdenes,
  };
}
