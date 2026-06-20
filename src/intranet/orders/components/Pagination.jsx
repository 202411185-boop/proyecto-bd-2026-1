import React from 'react';
import { COLORS, styles } from '../styles';

export default function Pagination({ pagina, totalPaginas, onCambiarPagina }) {
  const esPrimera = pagina === 0;
  const esUltima = pagina + 1 >= totalPaginas;

  return (
    <div style={styles.paginacion}>
      <button
        style={{
          ...styles.botonPaginacion,
          background: COLORS.green,
          opacity: esPrimera ? 0.5 : 1,
          cursor: esPrimera ? 'not-allowed' : 'pointer',
        }}
        onClick={() => onCambiarPagina(Math.max(0, pagina - 1))}
        disabled={esPrimera}
      >
        ← Anterior
      </button>

      <span style={styles.textoPagina}>
        Página {pagina + 1} de {totalPaginas}
      </span>

      <button
        style={{
          ...styles.botonPaginacion,
          background: COLORS.edit,
          opacity: esUltima ? 0.5 : 1,
          cursor: esUltima ? 'not-allowed' : 'pointer',
        }}
        onClick={() => onCambiarPagina(esUltima ? pagina : pagina + 1)}
        disabled={esUltima}
      >
        Siguiente →
      </button>
    </div>
  );
}
