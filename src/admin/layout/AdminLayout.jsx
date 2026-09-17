import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useQuotesStore } from '../store/useQuotesStore';
import { useInvoicesStore } from '../store/useInvoicesStore';
import { LayoutDashboard, Users, FileText, FileSpreadsheet, Calendar, Car, Settings, LogOut, Briefcase } from 'lucide-react';

const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const fetchQuotes = useQuotesStore((state) => state.fetchQuotes);
  const fetchInvoices = useInvoicesStore((state) => state.fetchInvoices);
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchSettings();
    fetchQuotes();
    fetchInvoices();
  }, [fetchSettings, fetchQuotes, fetchInvoices]);

  const handleLogout = () => {
    logout();
    navigate('/sely-office/login');
  };

  const navItems = [
    { path: '/sely-office/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/sely-office/reservations', label: 'Réservations & Whop', icon: Calendar },
    { path: '/sely-office/clients', label: 'Clients', icon: Users },
    { path: '/sely-office/quotes', label: 'Devis', icon: FileText },
    { path: '/sely-office/invoices', label: 'Factures', icon: FileSpreadsheet },
    { path: '/sely-office/services', label: 'Prestations', icon: Briefcase },
    { path: '/sely-office/fleet', label: 'Flotte & Chauffeurs', icon: Car },
    { path: '/sely-office/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        borderRight: '1px solid var(--border-glass)',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase color="var(--gold-accent)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '1px' }}>OFFICE</span>
        </div>

        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  color: isActive ? 'var(--gold-accent)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(196, 161, 101, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 500 : 400,
                })}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '2rem' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#ff4444',
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{
          height: '70px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
            SELY Administration
          </h2>
        </header>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
