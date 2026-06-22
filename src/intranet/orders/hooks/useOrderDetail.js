import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// ───────────────────────────────────────────────
// Hook: useOrderDetail
// Carga las líneas de orderdetails de una orden
// específica, junto con el nombre real del producto
// (products.productname, ya confirmado en Supabase).
// ───────────────────────────────────────────────
export function useOrderDetail(orderid) {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!orderid) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('orderdetails')
      .select('orderdetailid, orderid, productid, quantity, products ( productname )')
      .eq('orderid', orderid)
      .order('orderdetailid', { ascending: true });

    if (error) {
      setError(error.message);
      setLineas([]);
    } else {
      setLineas(data || []);
    }
    setLoading(false);
  }, [orderid]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { lineas, loading, error, recargar: cargar };
}
