import React, { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Save } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-glass)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    width: '100%',
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Paramètres de la Société</h1>
        <button
          onClick={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--gold-accent)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Save size={18} />
          Enregistrer
        </button>
      </div>

      {saved && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', borderRadius: '8px', marginBottom: '2rem' }}>
          Paramètres enregistrés avec succès.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Nom de la Société</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={inputStyle} />
          </div>
          
          <div>
            <label style={labelStyle}>Forme Juridique</label>
            <input type="text" name="legalForm" value={formData.legalForm} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Capital</label>
            <input type="text" name="capital" value={formData.capital} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Adresse du Siège</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Site Web</label>
            <input type="text" name="website" value={formData.website || ''} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Exploité par</label>
            <input type="text" name="exploitePar" value={formData.exploitePar || ''} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Numéro SIRET</label>
            <input type="text" name="siret" value={formData.siret || ''} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Numéro RCS</label>
            <input type="text" name="rcs" value={formData.rcs} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Numéro TVA Intracommunautaire</label>
            <input type="text" name="vat" value={formData.vat} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Téléphone de contact</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Email de contact</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>IBAN</label>
            <input type="text" name="iban" value={formData.iban} onChange={handleChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>BIC</label>
            <input type="text" name="bic" value={formData.bic} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Conditions d'annulation (Devis / Factures)</label>
            <textarea 
              name="cancellationPolicy" 
              value={formData.cancellationPolicy} 
              onChange={handleChange} 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
