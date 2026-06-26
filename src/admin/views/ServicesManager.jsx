import React, { useState } from 'react';
import { useServicesStore } from '../store/useServicesStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const ServicesManager = () => {
  const { services, addService, updateService, deleteService } = useServicesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: ''
  });

  const openModal = (service = null) => {
    if (service) {
      setCurrentService(service);
      setFormData(service);
    } else {
      setCurrentService(null);
      setFormData({ title: '', description: '', basePrice: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentService) {
      updateService(currentService.id, formData);
    } else {
      addService(formData);
    }
    closeModal();
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-glass)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    width: '100%',
    marginBottom: '1rem',
    fontFamily: 'inherit'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Catalogue des Prestations</h1>
        <button
          onClick={() => openModal()}
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
          <Plus size={18} />
          Nouvelle Prestation
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Titre</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Prix de base</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aucune prestation dans le catalogue.
                </td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{service.title}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {service.description.length > 50 ? service.description.substring(0, 50) + '...' : service.description}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{service.basePrice ? `${service.basePrice} €` : '-'}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(service)} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit2 size={18} /></button>
                    <button onClick={() => deleteService(service.id)} style={{ color: '#ff4444' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentService ? 'Modifier la prestation' : 'Nouvelle Prestation'}</h2>
              <button onClick={closeModal} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
              <div><input required placeholder="Titre de la prestation" style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
              <div><input type="number" placeholder="Prix de base (€) (Optionnel)" style={inputStyle} value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} /></div>
              <div>
                <textarea 
                  required 
                  placeholder="Description" 
                  style={{...inputStyle, minHeight: '120px', resize: 'vertical'}} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-glass)', color: 'white' }}>Annuler</button>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--gold-accent)', color: '#000', fontWeight: 500 }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
