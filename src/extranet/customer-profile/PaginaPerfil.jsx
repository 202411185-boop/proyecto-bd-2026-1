import React from 'react';

export default function ProfilePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>👤 Perfil del Cliente (Datos Demográficos)</h2>
      <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '4px' }}>
        <p><strong>Compañía:</strong> Alfreds Futterkiste</p>
        <p><strong>Contacto:</strong> Maria Anders</p>
        <p><strong>País/Ciudad:</strong> Alemania / Berlín</p>
        <hr />
        <p><strong>Segmentación de Cliente (CustomerDemographics):</strong></p>
        <span style={{ background: '#e0e0e0', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
          Cliente Corporativo VIP
        </span>
      </div>
    </div>
  );
}