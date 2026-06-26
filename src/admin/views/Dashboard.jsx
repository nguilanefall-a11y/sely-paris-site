import React from 'react';
import { TrendingUp, FileText, CheckCircle, Calendar } from 'lucide-react';
import { useQuotesStore } from '../store/useQuotesStore';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { useClientsStore } from '../store/useClientsStore';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="glass-panel" style={{
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{title}</p>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 600 }}>{value}</h3>
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'rgba(196, 161, 101, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} color="var(--gold-accent)" />
      </div>
    </div>
    {trend && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
        <span style={{ color: '#4ade80' }}>{trend}</span>
        <span style={{ color: 'var(--text-secondary)' }}>vs mois dernier</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { quotes } = useQuotesStore();
  const { invoices } = useInvoicesStore();
  const { clients } = useClientsStore();

  // 1. Chiffre d'Affaires : Somme des devis "accepted" ou factures "paid"
  // On va se baser sur les devis acceptés pour le CA prévisionnel, ou les factures payées.
  // Pour l'instant, disons la somme totale TTC des devis acceptés.
  const caTotal = quotes
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => {
      const qTotal = (q.items || []).reduce((acc, item) => acc + (item.price * item.qty), 0);
      const tvaAmount = qTotal * (q.tvaRate / 100);
      return sum + qTotal + tvaAmount;
    }, 0);

  // 2. Devis en attente
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;

  // 3. Acomptes reçus : Somme des acomptes (30%) des devis acceptés
  const acomptesTotal = caTotal * 0.3;

  // 4. Prestations à venir : Nombre de devis acceptés (simplification)
  const upcomingServices = quotes.filter(q => q.status === 'accepted').length;

  // Dernières prestations (5 derniers devis acceptés)
  const lastAcceptedQuotes = [...quotes]
    .filter(q => q.status === 'accepted')
    .slice(0, 5);

  // Nouveaux clients (5 derniers)
  const newClients = [...clients]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Tableau de Bord</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        <StatCard title="Chiffre d'Affaires (Prévisionnel)" value={`${caTotal.toFixed(2)} €`} icon={TrendingUp} />
        <StatCard title="Devis en attente" value={pendingQuotes} icon={FileText} />
        <StatCard title="Acomptes (30% des devis acceptés)" value={`${acomptesTotal.toFixed(2)} €`} icon={CheckCircle} />
        <StatCard title="Prestations à venir" value={upcomingServices} icon={Calendar} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500 }}>Dernières Prestations (Devis acceptés)</h3>
          {lastAcceptedQuotes.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Aucune donnée pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lastAcceptedQuotes.map(q => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{q.quoteNumber}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{q.clientFirstName} {q.clientLastName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 500, color: 'var(--gold-accent)' }}>
                      {((q.items || []).reduce((acc, item) => acc + (item.price * item.qty), 0) * (1 + q.tvaRate / 100)).toFixed(2)} €
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 500 }}>Nouveaux Clients</h3>
          {newClients.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Aucune donnée pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {newClients.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.email}</div>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {c.company || 'Particulier'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
