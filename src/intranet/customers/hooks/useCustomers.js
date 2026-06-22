import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

export function useCustomers() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  const totalPaginas = Math.max(1, Math.ceil(totalFilas / PAGE_SIZE));

  const cargarClientes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = pagina * PAGE_SIZE;
    const hasta = desde + PAGE_SIZE - 1;

    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('customerid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      query = query.ilike('customername', `%${busqueda.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      setError(error.message);
      setClientes([]);
    } else {
      setClientes(data || []);
      setTotalFilas(count || 0);
    }
    setLoading(false);
  }, [pagina, busqueda]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    setPagina(0);
  };

  // ── Actualizar dirección y ciudad ────────────────────────────────────────
  const handleActualizar = async (customerid, campos) => {
    const { error } = await supabase
      .from('customers')
      .update({ address: campos.address, city: campos.city })
      .eq('customerid', customerid);

    if (error) {
      alert(`No se pudo guardar: ${error.message}`);
      return false;
    }

    setClientes((prev) =>
      prev.map((c) =>
        c.customerid === customerid
          ? { ...c, address: campos.address, city: campos.city }
          : c
      )
    );
    return true;
  };

  // ── Eliminación en cascada ───────────────────────────────────────────────
  // Orden: orderdetails → orders → customers
  // (de hijo a padre, porque las FK bloquean el DELETE en Supabase
  //  si no hay ON DELETE CASCADE configurado en la BD)
  // ─────────────────────────────────────────────────────────────────────────
  const handleEliminar = async (customerid, customername) => {
    const confirmar = window.confirm(
      `¿Eliminar a "${customername}"?\n\n` +
      `Esto también eliminará todos sus pedidos y sus detalles.\n` +
      `Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    console.log(`[ELIMINAR] Iniciando cascada para customerid=${customerid}`);

    // ── Paso 1: obtener los orderid del cliente ──────────────────────────
    const { data: ordenes, error: errOrdenes } = await supabase
      .from('orders')
      .select('orderid')
      .eq('customerid', customerid);

    if (errOrdenes) {
      console.error('[ELIMINAR] Error en Paso 1 (obtener orders):', errOrdenes);
      alert(`Error al consultar pedidos: ${errOrdenes.message}`);
      return;
    }

    const orderIds = (ordenes || []).map((o) => o.orderid);
    console.log(`[ELIMINAR] Paso 1 OK — órdenes encontradas: ${orderIds.length}`, orderIds);

    // ── Paso 2: borrar orderdetails ──────────────────────────────────────
    if (orderIds.length > 0) {
      const { error: errDetalles } = await supabase
        .from('orderdetails')
        .delete()
        .in('orderid', orderIds);

      if (errDetalles) {
        console.error('[ELIMINAR] Error en Paso 2 (borrar orderdetails):', errDetalles);
        alert(`Error al eliminar detalles de pedidos: ${errDetalles.message}`);
        return;
      }
      console.log('[ELIMINAR] Paso 2 OK — orderdetails eliminados');
    } else {
      console.log('[ELIMINAR] Paso 2 omitido — no había órdenes');
    }

    // ── Paso 3: borrar orders ────────────────────────────────────────────
    if (orderIds.length > 0) {
      const { error: errOrders } = await supabase
        .from('orders')
        .delete()
        .eq('customerid', customerid);

      if (errOrders) {
        console.error('[ELIMINAR] Error en Paso 3 (borrar orders):', errOrders);
        alert(`Error al eliminar pedidos: ${errOrders.message}`);
        return;
      }
      console.log('[ELIMINAR] Paso 3 OK — orders eliminadas');
    }

    // ── Paso 4: borrar el customer ───────────────────────────────────────
    const { error: errCliente } = await supabase
      .from('customers')
      .delete()
      .eq('customerid', customerid);

    if (errCliente) {
      console.error('[ELIMINAR] Error en Paso 4 (borrar customer):', errCliente);
      alert(`Error al eliminar el cliente: ${errCliente.message}`);
      return;
    }

    console.log('[ELIMINAR] Paso 4 OK — cliente eliminado. Cascada completa ✓');

    if (clientes.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarClientes();
    }
  };

  return {
    clientes,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleActualizar,
    handleEliminar,
  };
}

export function useCustomersReport() {
  const [datosVentas, setDatosVentas] = useState([]);
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [errorVentas, setErrorVentas] = useState(null);

  useEffect(() => {
    async function obtenerReporte() {
      try {
        setCargandoVentas(true);
        const { data, error } = await supabase
          .from('view_ventas_por_cliente_grupo1')
          .select('*')
          .order('total_ventas', { ascending: false });

        if (error) throw error;
        setDatosVentas(data || []);
      } catch (err) {
        setErrorVentas(err.message);
      } finally {
        setCargandoVentas(false);
      }
    }
    obtenerReporte();
  }, []);

  return { datosVentas, cargandoVentas, errorVentas };
}
