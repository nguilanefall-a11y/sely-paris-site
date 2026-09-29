import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Parse hash fragment for access_token or id_token
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken || idToken) {
        // Fetch profile info from Google API
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const googleUser = {
              id: `usr_google_${data.sub || Date.now()}`,
              email: (data.email || '').toLowerCase(),
              name: data.name || 'Client Google',
              firstName: data.given_name || 'Client',
              lastName: data.family_name || '',
              avatar: data.picture || '',
              provider: 'google',
              emailVerified: data.email_verified || true,
            };

            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                { type: 'SELY_GOOGLE_AUTH_SUCCESS', user: googleUser },
                window.location.origin
              );
              window.close();
            } else {
              navigate('/paris/voyages');
            }
          })
          .catch((err) => {
            console.error('Failed to fetch Google profile:', err);
            navigate('/paris/voyages');
          });
      } else {
        navigate('/paris/voyages');
      }
    } catch (e) {
      console.error('Error handling Google callback:', e);
      navigate('/paris/voyages');
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#ffffff',
        color: '#5f6368',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            margin: '0 auto 1rem',
            border: '3px solid #dadce0',
            borderTopColor: '#1a73e8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <div>Connexion Google en cours...</div>
      </div>
    </div>
  );
}
