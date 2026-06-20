// src/intranet/layout/MenuIntranet.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

// ───────────────────────────────────────────────
// Paleta "Metro" (la misma que usa Proveedores en styles.js)
// ───────────────────────────────────────────────
const COLORS = {
  yellow: '#F4C300',
  red: '#7A1212',
  redDark: '#5C0D0D',
  cream: '#FBF6D9',
  text: '#3A2A00',
};

// ───────────────────────────────────────────────
// Íconos en SVG inline (sin dependencias externas).
// Cada uno recibe "color" para heredar el estilo activo/inactivo.
// ───────────────────────────────────────────────
const icons = {
  dashboard: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  productos: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
    </svg>
  ),
  pedidos: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2h6l1 4H8l1-4z" /><path d="M4 6h16l-1.5 14a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L4 6z" />
      <path d="M9 11h6" /><path d="M9 15h6" />
    </svg>
  ),
  clientes: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  empleados: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  transporte: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 9h3l3 3v5h-6V9z" />
      <circle cx="5.5" cy="18.5" r="1.8" /><circle cx="17.5" cy="18.5" r="1.8" />
    </svg>
  ),
  proveedores: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /><path d="M9 11h.01" /><path d="M15 11h.01" />
    </svg>
  ),
  logout: (color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

// ───────────────────────────────────────────────
// Items del menú: ruta exacta tal cual están montadas
// en IntranetRoutes.jsx (todas relativas a /intranet)
// ───────────────────────────────────────────────
const menuItems = [
  { to: '/intranet', label: 'Dashboard Principal', icon: 'dashboard', end: true },
  { to: '/intranet/producto', label: 'Productos', icon: 'productos' },
  { to: '/intranet/ordenes', label: 'Pedidos', icon: 'pedidos' },
  { to: '/intranet/cliente', label: 'Clientes', icon: 'clientes' },
  { to: '/intranet/personal', label: 'Empleados', icon: 'empleados' },
  { to: '/intranet/transporte', label: 'Transporte', icon: 'transporte' },
  { to: '/intranet/proveedor', label: 'Proveedores', icon: 'proveedores' },
];

export default function MenuIntranet({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.cream, fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <style>{`
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      
      {/* ───────── BARRA LATERAL ───────── */}
      <aside
        style={{
          width: '230px',
          minWidth: '230px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: COLORS.red,
        }}
      >
        <div>
          {/* Logo / marca */}
          <div
            style={{
              background: COLORS.yellow,
              padding: '1.6rem 1rem',
              display: 'flex',
              flexDirection: 'column', //apilarlo verticalmente
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem', //reducir espacio entre logo y texto
            }}
          >
            <img
              src={logo}
              alt="Metro"
              style={{ width: '120px', height: '70px', borderRadius: '1px', objectFit: 'cover' }}
            />
           
          </div>

          {/* Navegación */}
          <nav style={{ padding: '1.2rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.7rem',
                    padding: '0.7rem 0.8rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: active ? COLORS.red : '#fff',
                    background: active ? COLORS.yellow : 'transparent',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = COLORS.redDark;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {icons[item.icon](active ? COLORS.red : '#fff')}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pie: usuario + cerrar sesión */}
        <div style={{ padding: '1rem 0.8rem 1.4rem', borderTop: `1px solid ${COLORS.redDark}` }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 0.7rem 0', textAlign: 'center' }}>
            Admin: Pepo
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#fff',
              color: COLORS.red,
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {icons.logout(COLORS.red)}
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ───────── CONTENIDO DEL MÓDULO ACTIVO ───────── */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
