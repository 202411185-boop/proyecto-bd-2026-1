import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useOrders
// Centraliza toda la comunicación con Supabase para
// el módulo de Órdenes: lectura (con nombre de cliente),
// búsqueda por customerid, paginación, creación y
// borrado en cascada (orderdetails + orders).
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

    let query = supabase
      .from('orders')
      .select(
        `
        orderid,
        customerid,
        employeeid,
        orderdate,
        shipperid,
        customers ( customername )
      `,
        { count: 'exact' }
      )
      .order('orderid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      // Búsqueda por ID de cliente (customerid).
      const texto = busqueda.trim();
      if (!Number.isNaN(Number(texto))) {
        query = query.eq('customerid', Number(texto));
      } else {
        // Si no es numérico, no se aplica filtro: customerid
        // es numérico, así que un texto no numérico no puede
        // coincidir con ningún registro.
        query = query.eq('customerid', -1);
      }
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
      `¿Eliminar la orden #${orderid}? Esto también eliminará todos los ` +
        `productos asociados a este pedido. Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    // 1. Borra primero las líneas de orderdetails asociadas,
    //    porque la foreign key no permite borrar la orden
    //    mientras todavía tenga "hijos" en orderdetails.
    const { error: errorDetalles } = await supabase
      .from('orderdetails')
      .delete()
      .eq('orderid', orderid);

    if (errorDetalles) {
      alert(`No se pudo eliminar el detalle del pedido: ${errorDetalles.message}`);
      return;
    }

    // 2. Ya sin hijos, se borra la orden con seguridad.
    const { error } = await supabase.from('orders').delete().eq('orderid', orderid);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }

    if (ordenes.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarOrdenes();
    }
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
    recargar: cargarOrdenes,
  };
}
