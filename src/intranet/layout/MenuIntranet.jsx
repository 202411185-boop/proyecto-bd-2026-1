import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function IntranetLayout({ children }) {
  const navigate = useNavigate();

  const sidebarStyle = {
    width: '260px',
    background: '#1a202c',
    color: '#fff',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    padding: '20px 15px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const linkStyle = {
    color: '#cbd5e0',
    textDecoration: 'none',
    display: 'block',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '5px',
    fontSize: '14px',
    transition: 'background 0.2s'
  };

  const hoverEffect = (e) => e.target.style.background = '#2d3748';
  const leaveEffect = (e) => e.target.style.background = 'transparent';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      {/*  MENÚ RETAIL */}
      <aside style={sidebarStyle}>
        <div>
          <div style={{ borderBottom: '1px solid #2d3748', paddingBottom: '15px', marginBottom: '15px', textAlign: 'center' }}>
            <h2 style={{ color: '#ecc94b', margin: 0, fontSize: '18px' }}> Retail Intranet</h2>
            <small style={{ color: '#a0aec0' }}>ERP - Control Corporativo</small>
          </div>

          <nav>
            <Link to="/intranet" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              📊 Dashboard Principal
            </Link>
            <Link to="/intranet/producto" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              📦 Productos (producto)
            </Link>
            <Link to="/intranet/ordenes" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              📋 Pedidos (ordenes)
            </Link>
            <Link to="/intranet/cliente" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              👤 Directorio Clientes
            </Link>
            <Link to="/intranet/personal" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              👥 Personal (personal)
            </Link>
            <Link to="/intranet/transporte" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              🚚 Transportistas (transporte)
            </Link>
            <Link to="/intranet/proveedor" style={linkStyle} onMouseEnter={hoverEffect} onMouseLeave={leaveEffect}>
              🏢 Proveedores (proveedor)
            </Link>
          </nav>
        </div>

        {/* Sección inferior */}
        <div style={{ borderTop: '1px solid #2d3748', paddingTop: '15px', fontSize: '14px' }}>
          <p style={{ margin: '0 0 10px 0', color: '#ecc94b' }}>👤 Admin: Sanabria-Favio</p>
          <button 
            onClick={() => navigate('/')} 
            style={{ width: '100%', background: '#e53e3e', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 🖥️ VISTA CENTRAL DINÁMICA */}
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '30px', boxSizing: 'border-box' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', minHeight: '85vh' }}>
          {children}
        </div>
      </main>
    </div>
  );
}