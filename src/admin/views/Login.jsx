import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Lock } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      navigate('/sely-office/dashboard');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-color)'
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-glass)'
          }}>
            <Lock size={28} color="var(--gold-accent)" />
          </div>
        </div>
        
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>SELY Office</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Espace d'administration sécurisé
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            autoFocus
          />
          {error && <p style={{ color: '#ff4444', fontSize: '0.875rem', textAlign: 'left' }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--gold-accent)',
              color: '#000',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
