import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useSuppliers
// Centraliza toda la comunicación con Supabase para
// el módulo de Proveedores (lectura, búsqueda,
// paginación y borrado).
// ───────────────────────────────────────────────
export function useSuppliers() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  const totalPaginas = Math.max(1, Math.ceil(totalFilas / PAGE_SIZE));

  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = pagina * PAGE_SIZE;
    const hasta = desde + PAGE_SIZE - 1;

    let query = supabase
      .from('suppliers')
      .select('*', { count: 'exact' })
      .order('supplierid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      query = query.ilike('suppliername', `%${busqueda.trim()}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      setError(error.message);
      setProveedores([]);
    } else {
      setProveedores(data || []);
      setTotalFilas(count || 0);
    }
    setLoading(false);
  }, [pagina, busqueda]);

  useEffect(() => {
    cargarProveedores();
  }, [cargarProveedores]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    setPagina(0);
  };

  const handleEliminar = async (supplierid, suppliername) => {
    const confirmar = window.confirm(
      `¿Eliminar al proveedor "${suppliername}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('supplierid', supplierid);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }

    // Si era el último de la página y no es la primera, retrocede una página
    if (proveedores.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarProveedores();
    }
  };

  return {
    proveedores,
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
