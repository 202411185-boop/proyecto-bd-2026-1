import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { PAGE_SIZE } from '../styles';

// ───────────────────────────────────────────────
// Hook: useEmployees
// Centraliza toda la comunicación con Supabase para
// el módulo de Empleados (lectura, búsqueda,
// paginación y borrado).
// Tabla: employees
// Columnas: employeeid, lastname, firstname,
//           birthdate, photo, notes
// ───────────────────────────────────────────────
export function useEmployees() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalFilas, setTotalFilas] = useState(0);

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
      // Busca tanto por apellido como por nombre
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
    setPagina(0); // Vuelve a la primera página al buscar
  };

  const handleEliminar = async (employeeid, nombreCompleto) => {
    const confirmar = window.confirm(
      `¿Eliminar al empleado "${nombreCompleto}"? Esta acción no se puede deshacer.`
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

    // Si era el último de la página y no es la primera, retrocede una página
    if (empleados.length === 1 && pagina > 0) {
      setPagina((p) => p - 1);
    } else {
      cargarEmpleados();
    }
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
  };
}
