import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import ModalAñadirProducto from "./ModalAñadirProducto";

export default function PaginaProducto() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Cargar Categorías para el filtro de la cabecera
  useEffect(() => {
    async function cargarCategorias() {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        setCategorias(data || []);
      } catch (error) {
        console.error('Error cargando categorías:', error.message);
      }
    }
    cargarCategorias();
  }, []);

  // 2. Cargar directamente la tabla de Productos
  async function cargarProductos() {
    setLoading(true);
    setErrorMsg(null);
    try {
      let query = supabase.from('products').select('*');

      if (categoriaSeleccionada) {
        query = query.eq('categoryid', Number(categoriaSeleccionada));
      }

      const { data, error } = await query.order('productid', { ascending: true });

      if (error) {
        console.error('Error cargando productos (detalle completo):', error);
        throw error;
      }

      console.log('Productos recibidos de Supabase:', data);
      setProductos(data || []);
    } catch (error) {
      setErrorMsg(error.message || 'Error desconocido al cargar productos.');
      console.error('Error cargando productos:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, [categoriaSeleccionada]);

  // Se llama cuando el modal guarda con éxito (editar o crear) para refrescar la tabla
  function handleGuardado() {
    cargarProductos();
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333' }}>Módulo de Productos - Catálogo</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Inventario de artículos y lista de precios.</p>

      {/* Cabecera: filtro + botón de añadir producto, uno junto al otro */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filtrar por Categoría:</label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            <option value="">-- Todas las Categorías --</option>
            {categorias.map((cat) => (
              <option key={cat.categoryid} value={cat.categoryid}>{cat.categoryname}</option>
            ))}
          </select>
        </div>

        {/* Aquí aparece el botón "+ Añadir artículo" y su modal */}
        <ModalAñadirProducto onGuardado={handleGuardado} />
      </div>

      {/* Mensaje de error visible (RLS, permisos, nombre de tabla, etc.) */}
      {errorMsg && (
        <div style={{ padding: '10px 14px', marginBottom: '16px', backgroundColor: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
          Error al cargar productos: {errorMsg}
        </div>
      )}

      {/* Tabla de Productos */}
      {loading ? (
        <p>Cargando catálogo...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Nombre del Producto</th>
              <th style={{ padding: '12px' }}>ID Proveedor</th>
              <th style={{ padding: '12px' }}>ID Categoría</th>
              <th style={{ padding: '12px' }}>Presentación</th>
              <th style={{ padding: '12px' }}>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No hay productos para mostrar.</td>
              </tr>
            ) : (
              productos.map((item) => (
                <tr key={item.productid} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{item.productid}</td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{item.productname}</td>
                  <td style={{ padding: '12px' }}>{item.supplierid}</td>
                  <td style={{ padding: '12px' }}>{item.categoryid}</td>
                  <td style={{ padding: '12px', color: '#666' }}>{item.unit}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#1565c0' }}>
                    S/. {Number(item.price).toFixed(2)}
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
