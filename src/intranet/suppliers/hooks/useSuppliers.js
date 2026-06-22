import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

export function useSuppliers() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  const [modalConfig, setModalConfig] = useState(null);
  const [guardando, setGuardando] = useState(false);

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

  // ── ELIMINAR ──────────────────────────────────────
  const handleEliminar = async (supplierid, suppliername) => {
    const confirmar = window.confirm(
      `¿Eliminar al proveedor "${suppliername}"?\nEsta acción no se puede deshacer.`
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

    if (proveedores.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarProveedores();
    }
  };

  // ── ABRIR MODAL EDITAR ────────────────────────────
  const handleEditar = async (supplierid) => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('supplierid', supplierid)
      .single();

    if (error) {
      alert(`No se pudo cargar el proveedor: ${error.message}`);
      return;
    }
    setModalConfig({ modo: 'editar', proveedor: data });
  };

  // ── ABRIR MODAL AGREGAR ───────────────────────────
  const handleAbrirAgregar = () => {
    setModalConfig({ modo: 'agregar', proveedor: null });
  };

  // ── CERRAR MODAL ──────────────────────────────────
  const handleCerrarModal = () => {
    setModalConfig(null);
  };

  // ── GUARDAR (crear o actualizar) ──────────────────
  const handleGuardar = async (payload) => {
    setGuardando(true);

    if (modalConfig?.modo === 'editar') {
      const { error } = await supabase
        .from('suppliers')
        .update(payload)
        .eq('supplierid', modalConfig.proveedor.supplierid);

      if (error) {
        alert(`No se pudo actualizar: ${error.message}`);
        setGuardando(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('suppliers')
        .insert([payload]);

      if (error) {
        alert(`No se pudo agregar: ${error.message}`);
        setGuardando(false);
        return;
      }
    }

    setGuardando(false);
    setModalConfig(null);
    cargarProveedores();
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
    handleEditar,
    handleAbrirAgregar,
    handleCerrarModal,
    handleGuardar,
    modalConfig,
    guardando,
  };
}
