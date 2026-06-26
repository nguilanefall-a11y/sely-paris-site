import React from 'react';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Trash2, FileDown, CheckCircle, Clock } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDFTemplate from '../pdf/InvoicePDFTemplate';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const InvoicesManager = () => {
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoicesStore();
  const { settings } = useSettingsStore();

  const calculateTotalHT = (items) => (items || []).reduce((acc, item) => acc + (item.price * item.qty), 0);

  const toggleStatus = (invoice) => {
    const newStatus = invoice.status === 'pending' ? 'paid' : 'pending';
    updateInvoiceStatus(invoice.id, newStatus);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Gestion des Factures</h1>
        {/* Les factures sont générées depuis les devis acceptés */}
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
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Aucune facture enregistrée. Transformez un devis en facture pour commencer.
                </td>
              </tr>
            ) : (
              invoices.map(invoice => {
                const totalHT = calculateTotalHT(invoice.items);
                const totalTTC = totalHT * (1 + (invoice.tvaRate || 10) / 100);
                return (
                  <tr key={invoice.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{invoice.invoiceNumber}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {invoice.clientFirstName} {invoice.clientLastName}
                      {invoice.clientCompany && <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{invoice.clientCompany}</span>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{totalTTC.toFixed(2)} €</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button 
                        onClick={() => toggleStatus(invoice)}
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '0.85rem',
                          backgroundColor: invoice.status === 'pending' ? 'rgba(196, 161, 101, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                          color: invoice.status === 'pending' ? 'var(--gold-accent)' : '#4ade80',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {invoice.status === 'pending' ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {invoice.status === 'pending' ? 'En attente' : 'Payée'}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <PDFDownloadLink 
                        document={<InvoicePDFTemplate invoice={invoice} settings={settings} />} 
                        fileName={`${invoice.invoiceNumber}.pdf`}
                        style={{ color: 'var(--gold-accent)', display: 'flex', alignItems: 'center' }}
                      >
                        <FileDown size={18} />
                      </PDFDownloadLink>
                      <button onClick={() => deleteInvoice(invoice.id)} style={{ color: '#ff4444' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesManager;
