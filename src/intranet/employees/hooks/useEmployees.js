import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useEmployees
// Centraliza toda la comunicación con Supabase para
// el módulo de Empleados (lectura, búsqueda,
// paginación, borrado, creación y edición).
// Tabla: employees
// ───────────────────────────────────────────────
export function useEmployees() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

  // Estado para el modal (null = cerrado)
  const [modalConfig, setModalConfig] = useState(null);
  // { modo: 'agregar' | 'editar', empleado: objeto | null }
  const [guardando, setGuardando] = useState(false);

  const totalPaginas = Math.max(1, Math.ceil(totalFilas / PAGE_SIZE));

  const cargarEmpleados = useCallback(async () => {
    setLoading(true);
    setError(null);

    const desde = pagina * PAGE_SIZE;
    const hasta = desde + PAGE_SIZE - 1;

    let query = supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .order('employeeid', { ascending: true })
      .range(desde, hasta);

    if (busqueda.trim() !== '') {
      query = query.or(
        `lastname.ilike.%${busqueda.trim()}%,firstname.ilike.%${busqueda.trim()}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      setError(error.message);
      setEmpleados([]);
    } else {
      setEmpleados(data || []);
      setTotalFilas(count || 0);
    }
    setLoading(false);
  }, [pagina, busqueda]);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
    setPagina(0);
  };

  // ── ELIMINAR ──────────────────────────────────────
  // 1. El DELETE en employees dispara el SET NULL en la FK de orders
  //    (esto debe estar configurado en Supabase / PostgreSQL con
  //     ON DELETE SET NULL en la columna employeeid de orders).
  // 2. Aquí solo hacemos el DELETE; la BD se encarga del SET NULL.
  const handleEliminar = async (employeeid, nombreCompleto) => {
    const confirmar = window.confirm(
      `¿Eliminar al empleado "${nombreCompleto}"?\n\nSus pedidos asociados quedarán sin empleado asignado (SET NULL).\nEsta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('employeeid', employeeid);

    if (error) {
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }

    if (empleados.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarEmpleados();
    }
  };

  // ── ABRIR MODAL EDITAR ────────────────────────────
  const handleEditar = async (employeeid) => {
    // Cargamos el registro completo (puede tener más columnas que las visibles)
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employeeid', employeeid)
      .single();

    if (error) {
      alert(`No se pudo cargar el empleado: ${error.message}`);
      return;
    }
    setModalConfig({ modo: 'editar', empleado: data });
  };

  // ── ABRIR MODAL AGREGAR ───────────────────────────
  const handleAbrirAgregar = () => {
    setModalConfig({ modo: 'agregar', empleado: null });
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
        .from('employees')
        .update(payload)
        .eq('employeeid', modalConfig.empleado.employeeid);

      if (error) {
        alert(`No se pudo actualizar: ${error.message}`);
        setGuardando(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('employees')
        .insert([payload]);

      if (error) {
        alert(`No se pudo agregar: ${error.message}`);
        setGuardando(false);
        return;
      }
    }

    setGuardando(false);
    setModalConfig(null);
    cargarEmpleados();
  };

  return {
    empleados,
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

// ───────────────────────────────────────────────────────────────
// Hook: useEmployeesReport
// ───────────────────────────────────────────────────────────────
export function useEmployeesReport() {
  const [datosVentas, setDatosVentas] = useState([]);
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [errorVentas, setErrorVentas] = useState(null);

  useEffect(() => {
    async function obtenerReporte() {
      try {
        setCargandoVentas(true);
        setErrorVentas(null);

        const { data, error } = await supabase
          .from('view_ventas_empleado_temporal')
          .select('*')
          .order('anio', { ascending: false })
          .order('mes', { ascending: false })
          .order('id_empleado', { ascending: true });

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
