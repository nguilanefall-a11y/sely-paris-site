import React, { useState } from 'react';
import { useQuotesStore } from '../store/useQuotesStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { Plus, Edit2, Trash2, FileDown, X, Save, Copy, FileSpreadsheet } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDFTemplate from '../pdf/QuotePDFTemplate';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const QuotesManager = () => {
  const { quotes, addQuote, updateQuote, deleteQuote, duplicateQuote } = useQuotesStore();
  const { settings } = useSettingsStore();
  const { addInvoice } = useInvoicesStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuoteId, setCurrentQuoteId] = useState(null);

  // Default quote structure
  const defaultQuote = {
    clientType: 'particulier', // 'pro' or 'particulier'
    clientFirstName: '',
    clientLastName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientVat: '',
    tvaRate: 10,
    items: [{ title: 'Mise à disposition Chauffeur Privé', description: '', qty: 1, price: 0 }],
    quoteNumber: '',
    conditions: ''
  };

  const [formData, setFormData] = useState(defaultQuote);

  const openModal = (quote = null) => {
    if (quote) {
      setCurrentQuoteId(quote.id);
      setFormData({
        ...defaultQuote,
        ...quote,
        conditions: quote.conditions || settings.cancellationPolicy
      });
    } else {
      setCurrentQuoteId(null);
      const year = new Date().getFullYear();
      const number = (quotes.filter(q => q.quoteNumber?.includes(year)).length + 1).toString().padStart(4, '0');
      const generatedQuoteNumber = `DEV-${year}-${number}`;
      setFormData({
        ...defaultQuote,
        quoteNumber: generatedQuoteNumber,
        conditions: settings.cancellationPolicy
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === 'qty' || field === 'price') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { title: '', description: '', qty: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentQuoteId) {
      updateQuote(currentQuoteId, formData);
    } else {
      addQuote(formData);
    }
    closeModal();
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--border-glass)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    width: '100%',
    fontFamily: 'inherit'
  };

  const calculateTotalHT = (items) => items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Gestion des Devis</h1>
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
          Créer un Devis
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Numéro</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Client</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Montant TTC</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Statut</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aucun devis enregistré.
                </td>
              </tr>
            ) : (
              quotes.map(quote => {
                const totalHT = calculateTotalHT(quote.items);
                const totalTTC = totalHT * (1 + quote.tvaRate / 100);
                return (
                  <tr key={quote.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{quote.quoteNumber}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{format(new Date(quote.createdAt), 'dd/MM/yyyy')}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {quote.clientFirstName} {quote.clientLastName}
                      {quote.clientCompany && <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{quote.clientCompany}</span>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{totalTTC.toFixed(2)} €</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem',
                        backgroundColor: quote.status === 'pending' ? 'rgba(196, 161, 101, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                        color: quote.status === 'pending' ? 'var(--gold-accent)' : '#4ade80'
                      }}>
                        {quote.status === 'pending' ? 'En attente' : 'Validé'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <PDFDownloadLink 
                        document={<QuotePDFTemplate quote={quote} settings={settings} />} 
                        fileName={`${quote.quoteNumber}.pdf`}
                        style={{ color: 'var(--gold-accent)', display: 'flex', alignItems: 'center' }}
                        title="Télécharger le devis"
                      >
                        <FileDown size={18} />
                      </PDFDownloadLink>
                      
                      <button 
                        onClick={() => {
                          const status = quote.status === 'pending' ? 'accepted' : 'pending';
                          updateQuote(quote.id, { status });
                        }} 
                        style={{ color: quote.status === 'pending' ? '#4ade80' : 'var(--text-secondary)' }}
                        title={quote.status === 'pending' ? 'Valider le devis' : 'Annuler la validation'}
                      >
                        <Save size={18} />
                      </button>

                      {quote.status === 'accepted' && (
                        <button 
                          onClick={() => {
                            if(window.confirm('Créer une facture à partir de ce devis ?')) {
                              // We copy the quote data into a new invoice
                              const { id, quoteNumber, status, createdAt, ...invoiceData } = quote;
                              // The total TTC
                              const totalHT = calculateTotalHT(invoiceData.items);
                              const totalTTC = totalHT * (1 + invoiceData.tvaRate / 100);
                              addInvoice({ ...invoiceData, deposit: totalTTC * 0.3 });
                              alert('Facture créée avec succès !');
                            }
                          }}
                          style={{ color: '#60a5fa' }}
                          title="Convertir en facture"
                        >
                          <FileSpreadsheet size={18} />
                        </button>
                      )}

                      <button onClick={() => openModal(quote)} style={{ color: 'var(--text-secondary)' }} title="Modifier"><Edit2 size={18} /></button>
                      <button onClick={() => duplicateQuote(quote.id)} style={{ color: 'var(--text-secondary)' }} title="Dupliquer"><Copy size={18} /></button>
                      <button onClick={() => deleteQuote(quote.id)} style={{ color: '#ff4444' }} title="Supprimer"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', borderRadius: '12px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentQuoteId ? 'Modifier le Devis' : 'Nouveau Devis'}</h2>
              <button onClick={closeModal} style={{ color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              
              {/* Client Info Section */}
              <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-accent)' }}>Informations Générales</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Numéro de Devis</span>
                    <input name="quoteNumber" value={formData.quoteNumber} onChange={handleChange} style={{ ...inputStyle, width: '150px', padding: '0.5rem' }} />
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ marginRight: '1.5rem' }}>
                    <input type="radio" name="clientType" value="particulier" checked={formData.clientType === 'particulier'} onChange={handleChange} style={{ marginRight: '0.5rem' }} />
                    Particulier
                  </label>
                  <label>
                    <input type="radio" name="clientType" value="pro" checked={formData.clientType === 'pro'} onChange={handleChange} style={{ marginRight: '0.5rem' }} />
                    Professionnel
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input required={formData.clientType === 'particulier'} placeholder={formData.clientType === 'pro' ? 'Prénom (Optionnel)' : 'Prénom'} name="clientFirstName" style={inputStyle} value={formData.clientFirstName} onChange={handleChange} />
                  <input required={formData.clientType === 'particulier'} placeholder={formData.clientType === 'pro' ? 'Nom (Optionnel)' : 'Nom'} name="clientLastName" style={inputStyle} value={formData.clientLastName} onChange={handleChange} />
                  
                  {formData.clientType === 'pro' && (
                    <>
                      <input required placeholder="Nom de la société" name="clientCompany" style={inputStyle} value={formData.clientCompany} onChange={handleChange} />
                      <input placeholder="Numéro de TVA (Optionnel)" name="clientVat" style={inputStyle} value={formData.clientVat} onChange={handleChange} />
                    </>
                  )}
                  
                  <input type="email" placeholder="Email (Optionnel)" name="clientEmail" style={inputStyle} value={formData.clientEmail} onChange={handleChange} />
                  <input placeholder="Téléphone (Optionnel)" name="clientPhone" style={inputStyle} value={formData.clientPhone} onChange={handleChange} />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input required placeholder="Adresse complète" name="clientAddress" style={inputStyle} value={formData.clientAddress} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Prestations Section */}
              <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-accent)' }}>Détail des prestations</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>TVA (%)</span>
                    <input type="number" name="tvaRate" value={formData.tvaRate} onChange={handleChange} style={{ ...inputStyle, width: '80px', padding: '0.5rem' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {formData.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input placeholder="Désignation (ex: Transfert Aéroport CDG)" required style={inputStyle} value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} />
                        <textarea placeholder="Description détaillée (véhicule, horaires...)" style={{ ...inputStyle, fontSize: '0.85rem', minHeight: '80px', resize: 'vertical' }} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Qté</span>
                          <input type="number" min="1" step="0.5" required style={{ ...inputStyle, padding: '0.5rem' }} value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prix HT</span>
                          <input type="number" min="0" step="0.01" required style={{ ...inputStyle, padding: '0.5rem' }} value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} style={{ padding: '0.5rem', marginTop: '1.2rem', color: '#ff4444' }}><Trash2 size={20} /></button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button type="button" onClick={addItem} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-accent)', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Ajouter une ligne
                </button>
              </div>

              {/* Summary Section */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                <div style={{ width: '300px', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '8px' }}>
                  {(() => {
                    const totalHT = calculateTotalHT(formData.items);
                    const tva = totalHT * (formData.tvaRate / 100);
                    const totalTTC = totalHT + tva;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total HT</span><span>{totalHT.toFixed(2)} €</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TVA ({formData.tvaRate}%)</span><span>{tva.toFixed(2)} €</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)', marginTop: '0.5rem' }}>
                          <span>Total TTC</span><span>{totalTTC.toFixed(2)} €</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              {/* Conditions Section */}
              <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--gold-accent)' }}>Conditions du devis</h3>
                <textarea 
                  name="conditions" 
                  value={formData.conditions} 
                  onChange={handleChange} 
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
                  placeholder="Conditions générales d'annulation ou remarques..."
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-glass)', color: 'white' }}>Annuler</button>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: 'var(--gold-accent)', color: '#000', fontWeight: 500 }}>
                  <Save size={18} /> Enregistrer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesManager;
