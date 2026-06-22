import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useSuppliers
// Centraliza toda la comunicación con Supabase para
// el módulo de Proveedores (lectura, búsqueda,
// paginación, creación, edición y borrado).
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

  // Crea o actualiza un proveedor.
  // Si `datos.supplierid` viene definido, actualiza; si no, inserta uno nuevo.
  // Devuelve { ok: true } o { ok: false, message } para que el modal muestre el error.
  const handleGuardar = async (datos) => {
    const payload = {
      suppliername: datos.suppliername,
      contactname: datos.contactname || null,
      address: datos.address || null,
      city: datos.city || null,
      postalcode: datos.postalcode || null,
      country: datos.country || null,
      phone: datos.phone || null,
    };

    try {
      if (datos.supplierid) {
        // Editar existente
        const { error } = await supabase
          .from('suppliers')
          .update(payload)
          .eq('supplierid', datos.supplierid);

        if (error) throw error;
      } else {
        // Crear nuevo: calculamos el siguiente ID manualmente por si la
        // secuencia autoincremental de la tabla está desincronizada
        // (esto evita errores de "duplicate key value")
        const { data: maxRow, error: errMax } = await supabase
          .from('suppliers')
          .select('supplierid')
          .order('supplierid', { ascending: false })
          .limit(1)
          .single();

        if (errMax) throw errMax;

        const siguienteId = (maxRow?.supplierid || 0) + 1;

        const { error } = await supabase
          .from('suppliers')
          .insert([{ supplierid: siguienteId, ...payload }]);

        if (error) throw error;
      }

      cargarProveedores();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
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
    handleGuardar,
  };
}
