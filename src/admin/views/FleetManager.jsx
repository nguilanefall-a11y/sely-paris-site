import React, { useState } from 'react';
import { useFleetStore } from '../store/useFleetStore';
import { Plus, Edit2, Trash2, X, Car, User } from 'lucide-react';

const FleetManager = () => {
  const { drivers, vehicles, addDriver, updateDriver, deleteDriver, addVehicle, updateVehicle, deleteVehicle } = useFleetStore();
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' or 'drivers'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const defaultVehicle = { name: '', brand: '', model: '', licensePlate: '', type: 'van' };
  const defaultDriver = { firstName: '', lastName: '', phone: '', email: '', licenseNumber: '' };

  const [formData, setFormData] = useState({});

  const openModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setFormData(item);
    } else {
      setCurrentItem(null);
      setFormData(activeTab === 'vehicles' ? defaultVehicle : defaultDriver);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'vehicles') {
      if (currentItem) updateVehicle(currentItem.id, formData);
      else addVehicle(formData);
    } else {
      if (currentItem) updateDriver(currentItem.id, formData);
      else addDriver(formData);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Flotte & Chauffeurs</h1>
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
          {activeTab === 'vehicles' ? 'Nouveau Véhicule' : 'Nouveau Chauffeur'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('vehicles')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'vehicles' ? 'rgba(196, 161, 101, 0.2)' : 'transparent',
            color: activeTab === 'vehicles' ? 'var(--gold-accent)' : 'var(--text-secondary)',
            border: activeTab === 'vehicles' ? '1px solid var(--gold-accent)' : '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <Car size={18} />
          Véhicules
        </button>
        <button 
          onClick={() => setActiveTab('drivers')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: activeTab === 'drivers' ? 'rgba(196, 161, 101, 0.2)' : 'transparent',
            color: activeTab === 'drivers' ? 'var(--gold-accent)' : 'var(--text-secondary)',
            border: activeTab === 'drivers' ? '1px solid var(--gold-accent)' : '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <User size={18} />
          Chauffeurs
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {activeTab === 'vehicles' ? (
                <>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Nom</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Marque / Modèle</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Immatriculation</th>
                </>
              ) : (
                <>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Nom complet</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Contact</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>N° Carte VTC</th>
                </>
              )}
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'vehicles' ? (
              vehicles.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun véhicule enregistré.</td>
                </tr>
              ) : (
                vehicles.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{v.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{v.brand} {v.model}</td>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>{v.licensePlate}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button onClick={() => openModal(v)} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteVehicle(v.id)} style={{ color: '#ff4444' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              drivers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun chauffeur enregistré.</td>
                </tr>
              ) : (
                drivers.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{d.firstName} {d.lastName}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div>{d.phone}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>{d.licenseNumber}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button onClick={() => openModal(d)} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteDriver(d.id)} style={{ color: '#ff4444' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {currentItem ? 'Modifier' : 'Nouveau'} {activeTab === 'vehicles' ? 'Véhicule' : 'Chauffeur'}
              </h2>
              <button onClick={closeModal} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              {activeTab === 'vehicles' ? (
                <>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input required placeholder="Nom interne (ex: Van 1)" style={inputStyle} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div><input required placeholder="Marque (ex: Mercedes)" style={inputStyle} value={formData.brand || ''} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
                  <div><input required placeholder="Modèle (ex: Classe V)" style={inputStyle} value={formData.model || ''} onChange={e => setFormData({...formData, model: e.target.value})} /></div>
                  <div><input required placeholder="Immatriculation" style={inputStyle} value={formData.licensePlate || ''} onChange={e => setFormData({...formData, licensePlate: e.target.value})} /></div>
                  <div>
                    <select style={inputStyle} value={formData.type || 'van'} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="van">Van</option>
                      <option value="sedan">Berline</option>
                      <option value="suv">SUV</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div><input required placeholder="Prénom" style={inputStyle} value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div>
                  <div><input required placeholder="Nom" style={inputStyle} value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div>
                  <div><input required placeholder="Téléphone" style={inputStyle} value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                  <div><input type="email" placeholder="Email" style={inputStyle} value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input placeholder="N° Carte Pro VTC" style={inputStyle} value={formData.licenseNumber || ''} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} />
                  </div>
                </>
              )}
              
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

export default FleetManager;
