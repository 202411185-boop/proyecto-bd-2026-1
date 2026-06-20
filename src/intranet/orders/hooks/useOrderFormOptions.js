import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// ───────────────────────────────────────────────
// Hook: useOrderFormOptions
// Carga las listas de clientes, empleados y
// transportistas para usarlas en los <select>
// del formulario de Crear / Editar orden.
// ───────────────────────────────────────────────
export function useOrderFormOptions() {
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [loadingOpciones, setLoadingOpciones] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargarOpciones() {
      setLoadingOpciones(true);

      // Se pide '*' (todas las columnas) en vez de nombres
      // específicos como 'companyname' o 'firstname', porque
      // esos nombres de columna todavía no están confirmados
      // en tu base de datos y causaban error 400 al cargar.
      // El componente que usa estas listas debe armar el
      // texto a mostrar revisando qué campos vienen en cada
      // objeto (ver OrderFormModal.jsx).
      const [resClientes, resEmpleados, resTransportistas] = await Promise.all([
        supabase.from('customers').select('*').order('customerid'),
        supabase.from('employees').select('*').order('employeeid'),
        supabase.from('shippers').select('*').order('shipperid'),
      ]);

      if (!activo) return;

      setClientes(resClientes.data || []);
      setEmpleados(resEmpleados.data || []);
      setTransportistas(resTransportistas.data || []);
      setLoadingOpciones(false);
    }

    cargarOpciones();
    return () => {
      activo = false;
    };
  }, []);

  return { clientes, empleados, transportistas, loadingOpciones };
}
