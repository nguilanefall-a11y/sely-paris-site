import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleAuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If a real Google Cloud Client ID is present, redirect directly to Google OAuth endpoint
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== 'VOTRE_GOOGLE_CLIENT_ID') {
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${Date.now()}`;
      window.location.href = googleOAuthUrl;
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = (email || '').trim().toLowerCase();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setError('Veuillez saisir une adresse Gmail ou Google valide.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const rawName = clean.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const nameParts = formattedName.split(' ');
      const firstName = nameParts[0] || 'Client';
      const lastName = nameParts.slice(1).join(' ') || '';

      const googleUser = {
        id: `usr_google_${Date.now()}`,
        email: clean,
        name: formattedName,
        firstName,
        lastName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formattedName
        )}&background=4285F4&color=fff&size=128`,
        provider: 'google',
        emailVerified: true,
      };

      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage(
            { type: 'SELY_GOOGLE_AUTH_SUCCESS', user: googleUser },
            window.location.origin
          );
        } catch (err) {}
        window.close();
      } else {
        try {
          const raw = localStorage.getItem('sely_registered_accounts_v2');
          const accounts = raw ? JSON.parse(raw) : [];
          if (!accounts.some((a) => a.email.toLowerCase() === clean)) {
            localStorage.setItem(
              'sely_registered_accounts_v2',
              JSON.stringify([...accounts, googleUser])
            );
          }
          localStorage.setItem(
            'sely_auth_session_v2',
            JSON.stringify({
              token: `tok_g_${Date.now()}`,
              user: googleUser,
              createdAt: Date.now(),
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            })
          );
        } catch (err) {}
        navigate('/paris/voyages');
      }
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          background: '#ffffff',
          color: '#202124',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#202124' }}>
            Se connecter avec Google
          </span>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#5f6368', marginBottom: '0.85rem' }}>
          Accéder à SELY Paris
        </div>

        {error && (
          <div style={{ color: '#d93025', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre.email@gmail.com"
            autoFocus
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.65rem 0.8rem',
              fontSize: '0.9rem',
              color: '#202124',
              background: '#ffffff',
              border: '1px solid #dadce0',
              borderRadius: '6px',
              outline: 'none',
            }}
          />

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                if (window.opener) window.close();
                else navigate('/paris/voyages');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#5f6368',
                fontSize: '0.84rem',
                cursor: 'pointer',
                padding: '0.45rem 0.75rem',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#1a73e8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {loading ? 'Connexion...' : 'Continuer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
