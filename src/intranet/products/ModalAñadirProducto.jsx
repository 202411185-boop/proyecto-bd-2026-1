import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function ModalAñadirProducto({ onGuardado }) {
    const [mostrar, setMostrar] = useState(false);
    const [modo, setModo] = useState("editar"); // "editar" | "nuevo"
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productoId, setProductoId] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    // Campos editables (se usan tanto para editar como para crear nuevo)
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [unidad, setUnidad] = useState("");

    useEffect(() => {
        async function cargarDatos() {
        const { data: prods } = await supabase
            .from('products')
            .select('productid, productname, price, supplierid, categoryid, unit')
            .order('productname', { ascending: true });
        setProductos(prods || []);

        const { data: cats } = await supabase.from('categories').select('*');
        setCategorias(cats || []);
        }
        if (mostrar) cargarDatos();
    }, [mostrar]);

    // Cuando seleccionas un producto en modo "editar", precargamos sus datos
    useEffect(() => {
        if (modo !== "editar" || !productoId) return;
        const p = productos.find(p => p.productid === Number(productoId));
        if (p) {
        setNombre(p.productname || "");
        setPrecio(p.price ?? "");
        setSupplierId(p.supplierid ?? "");
        setCategoryId(p.categoryid ?? "");
        setUnidad(p.unit || "");
        }
    }, [productoId, modo, productos]);

    function cerrarModal() {
        setMostrar(false);
        setModo("editar");
        setProductoId("");
        setNombre("");
        setPrecio("");
        setSupplierId("");
        setCategoryId("");
        setUnidad("");
        setErrorMsg(null);
    }

    function cambiarModo(nuevoModo) {
        setModo(nuevoModo);
        setProductoId("");
        setNombre("");
        setPrecio("");
        setSupplierId("");
        setCategoryId("");
        setUnidad("");
        setErrorMsg(null);
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) cerrarModal();
    }

    async function handleGuardar() {
        setErrorMsg(null);

        if (!nombre || precio === "") {
        setErrorMsg("El nombre y el precio son obligatorios.");
        return;
        }

        setGuardando(true);
        try {
        if (modo === "editar") {
            if (!productoId) {
            setErrorMsg("Selecciona un producto para editar.");
            setGuardando(false);
            return;
            }
            const { error } = await supabase
            .from('products')
            .update({
                productname: nombre,
                price: Number(precio)
            })
            .eq('productid', Number(productoId));

            if (error) throw error;
        } else {
            // La secuencia autoincremental de la tabla puede estar desincronizada,
            // así que calculamos el siguiente ID manualmente: máximo actual + 1
            const { data: maxRow, error: errMax } = await supabase
            .from('products')
            .select('productid')
            .order('productid', { ascending: false })
            .limit(1)
            .single();

            if (errMax) throw errMax;

            const siguienteId = (maxRow?.productid || 0) + 1;

            const { error } = await supabase
            .from('products')
            .insert({
                productid: siguienteId,
                productname: nombre,
                price: Number(precio),
                supplierid: supplierId ? Number(supplierId) : null,
                categoryid: categoryId ? Number(categoryId) : null,
                unit: unidad || null
            });

            if (error) throw error;
        }

        if (onGuardado) onGuardado(); // avisa al padre para que recargue la tabla
        cerrarModal();
        } catch (error) {
        console.error('Error guardando producto:', error);
        setErrorMsg(error.message || 'Error al guardar el producto.');
        } finally {
        setGuardando(false);
        }
    }

    if (!mostrar) {
        return (
        <button onClick={() => setMostrar(true)} style={botonAbrirStyle}>
            + Producto
        </button>
        );
    }

    return (
        <div style={overlayStyle} onClick={handleOverlayClick}>
        <div style={boxStyle}>
            <h3 style={titleStyle}>
            {modo === "editar" ? "Editar producto" : "Nuevo producto"}
            </h3>

            {/* Selector de modo */}
            <div style={tabsStyle}>
            <button
                onClick={() => cambiarModo("editar")}
                style={modo === "editar" ? tabActivaStyle : tabInactivaStyle}
            >
                Editar existente
            </button>
            <button
                onClick={() => cambiarModo("nuevo")}
                style={modo === "nuevo" ? tabActivaStyle : tabInactivaStyle}
            >
                Producto nuevo
            </button>
            </div>

            {modo === "editar" && (
            <>
                <label style={labelStyle}>Producto</label>
                <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                style={inputStyle}
                >
                <option value="">-- Selecciona un producto --</option>
                {productos.map((p) => (
                    <option key={p.productid} value={p.productid}>
                    {p.productname}
                    </option>
                ))}
                </select>
            </>
            )}

            <label style={labelStyle}>Nombre del producto</label>
            <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={inputStyle}
            placeholder="Ej: Chais"
            />

            <label style={labelStyle}>Precio (S/.)</label>
            <input
            type="number"
            min="0"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={inputStyle}
            />

            {modo === "nuevo" && (
            <>
                <label style={labelStyle}>Categoría</label>
                <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={inputStyle}
                >
                <option value="">-- Selecciona categoría --</option>
                {categorias.map((cat) => (
                    <option key={cat.categoryid} value={cat.categoryid}>{cat.categoryname}</option>
                ))}
                </select>

                <label style={labelStyle}>ID Proveedor</label>
                <input
                type="number"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                style={inputStyle}
                placeholder="Ej: 1"
                />

                <label style={labelStyle}>Presentación</label>
                <input
                type="text"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                style={inputStyle}
                placeholder="Ej: 10 boxes x 20 bags"
                />
            </>
            )}

            {errorMsg && (
            <p style={errorStyle}>{errorMsg}</p>
            )}

            <div style={botonesStyle}>
            <button onClick={cerrarModal} style={botonCancelar}>Cancelar</button>
            <button onClick={handleGuardar} disabled={guardando} style={botonGuardar}>
                {guardando ? "Guardando..." : (modo === "editar" ? "Guardar cambios" : "Crear producto")}
            </button>
            </div>
        </div>
        </div>
    );
    }

    const botonAbrirStyle = {
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#e8a33d',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer'
    };

    const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
    };

    const boxStyle = {
    backgroundColor: '#fdf6e3',
    border: '2px solid #e8a33d',
    borderRadius: '12px',
    padding: '28px',
    width: '400px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    fontFamily: 'Arial, sans-serif',
    maxHeight: '90vh',
    overflowY: 'auto'
    };

    const titleStyle = {
    color: '#e8a33d',
    marginTop: 0,
    marginBottom: '16px',
    fontSize: '22px',
    fontWeight: 'bold'
    };

    const tabsStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
    };

    const tabBaseStyle = {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #e8a33d',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer'
    };

    const tabActivaStyle = {
    ...tabBaseStyle,
    backgroundColor: '#e8a33d',
    color: '#fff'
    };

    const tabInactivaStyle = {
    ...tabBaseStyle,
    backgroundColor: '#fff',
    color: '#e8a33d'
    };

    const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '6px',
    marginTop: '14px',
    color: '#333'
    };

    const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e8a33d',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    fontSize: '14px'
    };

    const errorStyle = {
    marginTop: '14px',
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: '13px'
    };

    const botonesStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '24px'
    };

    const botonCancelar = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#9e9e9e',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
    };

    const botonGuardar = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#43a047',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
    };
