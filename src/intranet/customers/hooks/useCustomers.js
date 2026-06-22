import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useCustomers
// Centraliza toda la comunicación con Supabase para
// el módulo de Clientes (lectura, búsqueda,
// paginación y borrado).
// Tabla: customers
// Columnas: customerid, customername, contactname,
//           address, city, postalcode, country
// ───────────────────────────────────────────────
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
    setPagina(0); // Vuelve a la primera página al buscar
  };

  const handleEliminar = async (customerid, customername) => {
    const confirmar = window.confirm(
      `¿Eliminar al cliente "${customername}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customerid', customerid);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }

    // Si era el último de la página y no es la primera, retrocede una página
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
          .from('view_ventas_por_cliente_grupo1') // Conexión directa a la vista
          .select('*')
          .order('id_cliente', { ascending: true }); // Mayor a menor venta

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