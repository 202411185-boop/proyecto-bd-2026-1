# 🛒 SISTEMA DE GESTIÓN Y ANÁLISIS DE VENTAS CON NORTHWIND

**Curso:** Fundamentos de Base de Datos  
**Institución:** Universidad Ricardo Palma — Ingeniería Informática 
**Equipo:** Mauricio Leiva · Thiago Rosado · Favio Sanabria · Rodrigo Núñez  
**Repositorio:** https://github.com/202411185-boop/proyecto-bd-2026-1

---

## 📋 Descripción

Sistema web de gestión administrativa inspirado en los supermercados **Metro / Cencosud**, construido sobre la base de datos **Northwind** alojada en **Supabase**. Cuenta con dos capas de acceso:

- **Extranet** — tienda pública donde los clientes pueden explorar productos y realizar compras.
- **Intranet** — panel administrativo protegido donde el administrador gestiona clientes, empleados, pedidos, productos, transportistas y proveedores en tiempo real, con operaciones de lectura, inserción, edición y eliminación conectadas directamente a Supabase.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | Librería principal de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router DOM | 7 | Navegación entre extranet e intranet |
| @supabase/supabase-js | 2 | Cliente oficial para comunicarse con Supabase |
| Supabase | — | Base de datos PostgreSQL en la nube (BD Northwind) |
| JavaScript (JSX) | ES Modules | Lenguaje de desarrollo |

---

## 🗂️ Estructura del proyecto

```
proyecto-bd-2026-1/
├── public/                        # Íconos y assets estáticos
├── src/
│   ├── App.jsx                    # Punto de entrada de React
│   ├── main.jsx                   # Montaje del árbol de componentes
│   ├── lib/
│   │   └── supabaseClient.js      # Inicialización del cliente Supabase (URL + API Key)
│   ├── routing/
│   │   └── AppRoutes.jsx          # Ruta raíz: decide entre extranet e intranet
│   │
│   ├── extranet/                  # Capa pública (tienda)
│   │   ├── auth/                  # Página de inicio de sesión
│   │   ├── home/                  # Página principal de la tienda
│   │   ├── cart/                  # Checkout y carrito
│   │   ├── customer-profile/      # Perfil del cliente
│   │   └── routing/               # Rutas de la extranet
│   │
│   └── intranet/                  # Capa administrativa (panel)
│       ├── layout/
│       │   └── MenuIntranet.jsx   # Menú lateral compartido por todos los módulos
│       ├── routing/
│       │   └── IntranetRoutes.jsx # Rutas del panel administrativo
│       ├── dashboard/             # Métricas resumen (ingresos, pedidos pendientes)
│       ├── customers/             # Módulo Clientes
│       │   ├── PaginaCliente.jsx          # Orquestador del módulo
│       │   ├── styles.js                  # Paleta Metro y estilos CSS-in-JS
│       │   ├── hooks/
│       │   │   └── useCustomers.js        # Lógica Supabase: SELECT, UPDATE, DELETE en cascada
│       │   └── components/
│       │       ├── CustomersTable.jsx     # Tabla con filas alternas
│       │       ├── EditClienteModal.jsx   # Pop-up de edición de dirección y ciudad
│       │       ├── SearchBar.jsx          # Buscador por nombre
│       │       └── Pagination.jsx         # Controles Anterior / Siguiente
│       ├── employees/             # Módulo Empleados
│       │   ├── PaginaEmpleado.jsx
│       │   ├── styles.js
│       │   ├── hooks/
│       │   │   └── useEmployees.js        # Lógica Supabase: SELECT, INSERT, UPDATE, SET NULL
│       │   └── components/
│       │       ├── EmployeesTable.jsx
│       │       ├── EmpleadoModal.jsx      # Pop-up compartido para editar y agregar
│       │       ├── SearchBar.jsx
│       │       └── Pagination.jsx
│       ├── orders/                # Módulo Pedidos
│       │   ├── PaginaOrdenes.jsx
│       │   ├── styles.js
│       │   ├── hooks/
│       │   │   ├── useOrders.js           # Lógica de órdenes
│       │   │   ├── useOrderDetail.js      # Detalle de una orden específica
│       │   │   └── useCustomers.js        # Clientes para el selector de nuevo pedido
│       │   └── components/
│       │       ├── OrdersTable.jsx
│       │       ├── OrderDetailsModal.jsx  # Pop-up con el detalle de productos de una orden
│       │       ├── NuevoPedidoModal.jsx   # Pop-up para crear un nuevo pedido
│       │       ├── HistorialClienteModal.jsx # Pop-up con historial de pedidos por cliente
│       │       ├── SearchBar.jsx
│       │       └── Pagination.jsx
│       ├── products/              # Módulo Productos
│       │   ├── PaginaProducto.jsx         # Listado con filtro por categoría
│       │   └── ModalAñadirProducto.jsx    # Pop-up para agregar productos
│       ├── shippers/              # Módulo Transporte
│       │   └── PaginaTransporte.jsx       # CRUD completo de transportistas
│       └── suppliers/             # Módulo Proveedores
│           ├── PaginaProveedor.jsx
│           ├── styles.js
│           ├── hooks/
│           │   └── useSuppliers.js
│           └── components/
│               ├── SuppliersTable.jsx
│               ├── ProveedorModal.jsx
│               ├── SearchBar.jsx
│               └── Pagination.jsx
├── .env                           # Variables de entorno (NO subir al repositorio)
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Módulos de la intranet

### 📊 Dashboard Principal
Panel de resumen con métricas calculadas en tiempo real: ingresos totales de ventas y pedidos pendientes por despachar, obtenidos de la tabla `orderdetails` de Supabase.

### 👥 Clientes
Gestión completa de la tabla `customers`. Permite buscar por nombre, navegar por páginas de 10 registros, **editar** la dirección y ciudad de un cliente mediante un pop-up, y **eliminar** un cliente con eliminación en cascada manual: primero se borran los `orderdetails` de sus órdenes, luego las `orders`, y finalmente el registro del cliente.

### 👤 Empleados
Gestión de la tabla `employees`. Permite buscar por apellido o nombre, **agregar** nuevos empleados, **editar** todos sus campos (apellido, nombre, fecha de cumpleaños, notas) y **eliminar** un empleado. Al eliminar, los pedidos que tenía asignados en la tabla `orders` no se borran — en cambio, su campo `employeeid` se establece en `NULL` (SET NULL), conservando el historial de órdenes.

### 🧾 Pedidos
Gestión de la tabla `orders`. Muestra los pedidos con su cliente, empleado asignado, fecha y transportista. Permite **ver el detalle** de productos de cada orden (tabla `orderdetails`), **crear nuevos pedidos**, consultar el **historial de pedidos por cliente** y eliminar pedidos.

### 📦 Productos
Listado de productos con filtro por categoría. Permite **agregar nuevos productos** mediante un pop-up conectado a la tabla `products` de Supabase.

### 🚚 Transporte
CRUD completo de la tabla `shippers` (transportistas): listar, agregar, editar y eliminar registros del servicio de transporte.

### 🏭 Proveedores
Gestión de la tabla `suppliers`. Permite buscar, paginar, **agregar**, **editar** y **eliminar** proveedores mediante un pop-up modal.

---

## 🗄️ Base de datos

La base de datos utilizada es **Northwind**, alojada en **Supabase** (PostgreSQL). Las tablas principales y sus relaciones son:

```
customers     ──┐
                ├──► orders ──► orderdetails ◄── products
employees     ──┘       │
                        └──► shippers
suppliers ──► products ◄── categories
```

| Relación | Tipo de FK | Comportamiento al eliminar |
|---|---|---|
| `orders.customerid → customers.customerid` | Sin CASCADE en BD | Cascada manual desde el código |
| `orders.employeeid → employees.employeeid` | Sin CASCADE en BD | SET NULL desde el código |
| `orderdetails.orderid → orders.orderid` | Sin CASCADE en BD | Borrado manual previo |

> Las FK no tienen `ON DELETE CASCADE` configurado en Supabase, por lo que la integridad referencial se gestiona manualmente desde los hooks de React, respetando el orden hijo → padre.

---

## ⚙️ Cómo ejecutar el proyecto

### Requisitos previos
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) (versión 18 o superior)

### Paso 1 — Clonar el repositorio

Abre una terminal en la carpeta donde quieras guardar el proyecto y ejecuta:

```bash
git clone https://github.com/202411185-boop/proyecto-bd-2026-1.git
cd proyecto-bd-2026-1
```

Si descargaste el `.zip`, descomprímelo y entra a la carpeta desde la terminal.

### Paso 2 — Instalar dependencias

```bash
npm install
```

Si alguna librería falla, instálalas puntualmente:

```bash
npm install react-router-dom
npm install @supabase/supabase-js
npm install vite
```

### Paso 3 — Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`) con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://peixlcpoytqiphmdikfu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_rF2iemwCw0PDxp3sP9P5xQ_-Uuh4x8vnp
```

> Las credenciales ya están incluidas arriba — solo copia y pega el bloque completo en tu archivo `.env`.

### Paso 4 — Levantar el servidor

Primero asegúrate de estar en la rama `develop`:

```bash
git checkout develop
```

Luego levanta el servidor:

```bash
npm run dev
```

La terminal mostrará algo como:

```
VITE ready in 500ms
→ Local: http://localhost:5174/
```

### Paso 5 — Abrir en el navegador

| Vista | URL |
|---|---|
| Tienda (extranet) | `http://localhost:5174/` |
| Panel administrativo (intranet) | `http://localhost:5174/intranet` |

> Se recomienda usar **Google Chrome** para la intranet. Firefox puede bloquear diálogos nativos del navegador (`window.confirm`) en ciertos contextos.

---

## 🔑 Variables de entorno

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://peixlcpoytqiphmdikfu.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_rF2iemwCw0PDxp3sP9P5xQ_-Uuh4x8vnp` |

---

## ✨ Funcionalidades destacadas

- **Eliminación en cascada manual** en el módulo Clientes: al eliminar un cliente se borran primero sus `orderdetails`, luego sus `orders`, y finalmente el cliente. Todo desde el código JavaScript, sin depender de `ON DELETE CASCADE` en la BD.
- **SET NULL al eliminar empleados**: los pedidos asignados al empleado eliminado conservan todos sus datos; solo se vacía el campo `employeeid`.
- **Modales reutilizables**: el mismo componente pop-up sirve para editar y agregar registros en Empleados y Proveedores, cambiando de modo según el contexto.
- **Arquitectura modular uniforme**: todos los módulos siguen el mismo patrón — orquestador, `styles.js`, hook personalizado con lógica Supabase, y componentes visuales separados (`Table`, `Modal`, `SearchBar`, `Pagination`).
- **Paginación del lado del servidor**: las queries a Supabase usan `.range()` para traer solo los 10 registros de la página actual, sin cargar toda la tabla en memoria.
- **Buscador reactivo**: al escribir en el campo de búsqueda se resetea a la primera página y se lanza una nueva query filtrada con `.ilike()` directamente en Supabase.
