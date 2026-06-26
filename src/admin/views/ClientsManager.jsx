import React, { useState } from 'react';
import { useClientsStore } from '../store/useClientsStore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const ClientsManager = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    siret: '',
    vat: ''
  });

  const openModal = (client = null) => {
    if (client) {
      setCurrentClient(client);
      setFormData(client);
    } else {
      setCurrentClient(null);
      setFormData({ firstName: '', lastName: '', company: '', email: '', phone: '', address: '', siret: '', vat: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentClient) {
      updateClient(currentClient.id, formData);
    } else {
      addClient(formData);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Gestion des Clients</h1>
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
          Nouveau Client
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Nom complet</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Société</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Contact</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aucun client enregistré.
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>{client.firstName} {client.lastName}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{client.company || '-'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>{client.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{client.phone}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button onClick={() => openModal(client)} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit2 size={18} /></button>
                    <button onClick={() => deleteClient(client.id)} style={{ color: '#ff4444' }}><Trash2 size={18} /></button>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentClient ? 'Modifier le Client' : 'Nouveau Client'}</h2>
              <button onClick={closeModal} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div><input required placeholder="Prénom" style={inputStyle} value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
              <div><input required placeholder="Nom" style={inputStyle} value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
              <div style={{ gridColumn: '1 / -1' }}><input placeholder="Société (Optionnel)" style={inputStyle} value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
              <div><input required type="email" placeholder="Email" style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div><input required placeholder="Téléphone" style={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              <div style={{ gridColumn: '1 / -1' }}><input placeholder="Adresse complète" style={inputStyle} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
              <div><input placeholder="SIRET" style={inputStyle} value={formData.siret} onChange={e => setFormData({...formData, siret: e.target.value})} /></div>
              <div><input placeholder="TVA Intracom." style={inputStyle} value={formData.vat} onChange={e => setFormData({...formData, vat: e.target.value})} /></div>
              
              <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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

export default ClientsManager;
