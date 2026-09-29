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
      navigate('/sely-office/reservations');
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
      backgroundColor: '#07090e',
      color: '#ffffff',
    }}>
      <div style={{
        padding: '3rem 2.5rem',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        background: '#121622',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            <Lock size={28} color="#c5a880" />
          </div>
        </div>
        
        <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 600, color: '#ffffff' }}>SELY Office</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Espace d'administration sécurisé
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Mot de passe administrateur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: '#0a0d14',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'inherit',
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

          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <a href="/paris" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              ← Retour au site public SELY
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
