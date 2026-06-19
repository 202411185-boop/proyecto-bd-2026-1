import React, { useState, useEffect } from 'react';
// Nota: Ajusta la ruta de importación de tu cliente de Supabase según cómo lo haya configurado Favio
import { supabase } from '../../../lib/supabaseClient'; 

export default function PaginaProducto() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Cargar las categorías para el filtro desplegable
  useEffect(() => {
    async function cargarCategorias() {
      try {
        const { data, error } = await supabase
          .from('Categories')
          .select('categoryid, categoryname');
        
        if (error) throw error;
        setCategorias(data || []);
      } catch (error) {
        console.error('Error cargando categorías:', error.message);
      }
    }
    cargarCategorias();
  }, []);

  // 2. Cargar los datos de la Vista (View) solicitada por el informe
  useEffect(() => {
    async function cargarDetalleFacturacion() {
      setLoading(true);
      try {
        // Consultamos directamente a la vista del backend
        let query = supabase.from('View_Detalle_Facturacion_Grupo1').select('*');

        // Si el usuario seleccionó una categoría, filtramos (se asume que la vista expone el ID o puedes filtrar localmente)
        if (categoriaSeleccionada) {
          // Si tu vista no tiene 'categoryid', puedes cambiar este filtro por el nombre o manejarlo de forma local
          query = query.eq('categoryid', categoriaSeleccionada);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProductos(data || []);
      } catch (error) {
        console.error('Error cargando la vista de facturación:', error.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDetalleFacturacion();
  }, [categoriaSeleccionada]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Módulo de Productos - Detalle de Facturación</h2>
      <p style={{ color: '#666' }}>Reporte consolidado de líneas de pedido y totales netos (Vista SQL del Grupo 1).</p>
      
      {/* Filtro por Categoría */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="categoria-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Filtrar por Categoría:
        </label>
        <select
          id="categoria-select"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">-- Todas las Categorías --</option>
          {categorias.map((cat) => (
            <option key={cat.categoryid} value={cat.categoryid}>
              {cat.categoryname}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Resultados */}
      {loading ? (
        <p>Cargando datos del servidor...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Código Pedido</th>
              <th style={{ padding: '12px' }}>ID Cliente</th>
              <th style={{ padding: '12px' }}>Producto</th>
              <th style={{ padding: '12px' }}>Precio Unitario</th>
              <th style={{ padding: '12px' }}>Cantidad</th>
              <th style={{ padding: '12px' }}>Descuento</th>
              <th style={{ padding: '12px' }}>Total Neto Línea</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              productos.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{item['Código Pedido']}</td>
                  <td style={{ padding: '12px' }}>{item['ID Cliente']}</td>
                  <td style={{ padding: '12px' }}>{item['Producto']}</td>
                  <td style={{ padding: '12px' }}>${item['Precio Unitario']}</td>
                  <td style={{ padding: '12px' }}>{item['Cantidad Solicitada']}</td>
                  <td style={{ padding: '12px' }}>{item['Descuento Aplicado'] * 100}%</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#2e7d32' }}>
                    ${item['Total Neto Línea']}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}