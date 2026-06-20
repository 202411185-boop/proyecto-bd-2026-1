import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useOrders
// Centraliza toda la comunicación con Supabase para
// el módulo de Órdenes (lectura con datos relacionados
// de cliente/empleado/transportista, búsqueda,
// paginación y borrado).
//
// IMPORTANTE: los nombres de columnas reales en Supabase
// son los de Northwind, en inglés (orderid, customerid,
// employeeid, orderdate, shipperid, companyname, etc).
// El español se usa solo en la interfaz visual.
// ───────────────────────────────────────────────
export function useOrders() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  const totalPaginas = Math.max(1, Math.ceil(totalFilas / PAGE_SIZE));

  const cargarOrdenes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = pagina * PAGE_SIZE;
    const hasta = desde + PAGE_SIZE - 1;

    // Por ahora solo se traen los IDs planos de la orden
    // (sin nombre de cliente/empleado/transportista), ya
    // que esas tablas relacionadas todavía no están
    // confirmadas. Cuando se confirmen los nombres reales
    // de columna en customers/employees/shippers, se puede
    // volver a agregar el join anidado aquí.
    let query = supabase
      .from('orders')
      .select(
        `
        orderid,
        customerid,
        employeeid,
        orderdate,
        shipperid
      `,
        { count: 'exact' }
      )
      .order('orderid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      // Busca por id de orden directamente (numérico).
      const texto = busqueda.trim();
      if (!Number.isNaN(Number(texto))) {
        query = query.eq('orderid', Number(texto));
      }
      // Si el texto no es numérico, no se aplica filtro:
      // todavía no hay columna de texto en 'orders' para
      // buscar por nombre.
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

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    setPagina(0);
  };

  const handleEliminar = async (orderid) => {
    const confirmar = window.confirm(
      `¿Eliminar la orden #${orderid}? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error } = await supabase.from('orders').delete().eq('orderid', orderid);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }

    // Si era el último de la página y no es la primera, retrocede una página
    if (ordenes.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarOrdenes();
    }
  };

  const crearOrden = async (payload) => {
    const { error } = await supabase.from('orders').insert([payload]);
    if (error) throw error;
    await cargarOrdenes();
  };

  const actualizarOrden = async (orderid, payload) => {
    const { error } = await supabase
      .from('orders')
      .update(payload)
      .eq('orderid', orderid);
    if (error) throw error;
    await cargarOrdenes();
  };

  return {
    ordenes,
    loading,
    error,
    busqueda,
    pagina,
    totalPaginas,
    setPagina,
    handleBuscar,
    handleEliminar,
    crearOrden,
    actualizarOrden,
    recargar: cargarOrdenes,
  };
}