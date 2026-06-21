// ───────────────────────────────────────────────
// Paleta "Metro" — módulo Empleados
// Idéntica a la de suppliers/ y customers/ para
// mantener consistencia visual en toda la intranet.
// ───────────────────────────────────────────────
export const COLORS = {
  yellow: '#F4C300',
  red: '#7A1212',
  cream: '#FBF6D9',
  tableHeader: '#E8941A',
  rowAlt: '#F6D98B',
  rowBase: '#FBF6D9',
  green: '#4CAF3D',
  edit: '#F4A11A',
  delete: '#B22222',
  text: '#3A2A00',
};

export const PAGE_SIZE = 10;

export const styles = {
  page: {
    padding: '0',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  titulo: {
    color: COLORS.tableHeader,
    fontSize: '2.2rem',
    fontWeight: 800,
    margin: '0 0 1.2rem 0',
  },
  panel: {
    background: '#F2DDA8',
    borderRadius: '10px',
    padding: '1.2rem',
  },
  barraSuperior: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
  },
  buscador: {
    flex: '0 0 320px',
    padding: '0.55rem 0.9rem',
    borderRadius: '6px',
    border: '1px solid #c9a45a',
    outline: 'none',
    fontSize: '0.9rem',
  },
  botonAgregar: {
    background: COLORS.green,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.6rem 1.4rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  tablaContenedor: {
    background: COLORS.cream,
    borderRadius: '8px',
    overflowX: 'auto',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    background: COLORS.tableHeader,
    color: '#fff',
    textAlign: 'left',
    padding: '0.6rem 0.9rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '0.55rem 0.9rem',
    color: COLORS.text,
    borderBottom: '1px solid #efe2ba',
    whiteSpace: 'nowrap',
  },
  tdMensaje: {
    padding: '1.2rem',
    textAlign: 'center',
    color: COLORS.text,
  },
  fotoCelda: {
    fontSize: '0.78rem',
    color: '#8A7A50',
    fontStyle: 'italic',
  },
  notaCelda: {
    maxWidth: '260px',
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  botonEditar: {
    background: COLORS.edit,
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.35rem 0.8rem',
    marginRight: '0.4rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  botonEliminar: {
    background: COLORS.delete,
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '0.35rem 0.8rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  paginacion: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.2rem',
    marginTop: '1rem',
  },
  botonPaginacion: {
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.55rem 1.3rem',
    fontWeight: 700,
  },
  textoPagina: {
    color: COLORS.text,
    fontWeight: 600,
    fontSize: '0.85rem',
  },
};
