import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Shield,
  CreditCard,
  Plus,
  Trash2,
  LogOut,
  ChevronRight,
  Home,
  MessageSquare,
  Phone,
  ArrowRight,
  Lock,
  Building2,
  Download,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useCity } from '../hooks/useCity';
import { useClientAuthStore } from '../store/useClientAuthStore';
import styles from './VoyagesPage.module.css';

export default function VoyagesPage({ defaultView = 'trips', hideBottomNav = false }) {
  const { city, getCityPath } = useCity();
  const navigate = useNavigate();
  const {
    user,
    trips,
    authLoading,
    authError,
    clearAuthError,
    loginWithGoogle,
    loginWithEmail,
    registerUser,
    logout,
    cancelTrip,
    updatePersonalInfo,
    updateFrequentAddresses,
    updatePaymentBilling,
  } = useClientAuthStore();

  const [currentView, setCurrentView] = useState(defaultView); // 'trips' | 'account'
  const [activeTab, setActiveTab] = useState('upcoming'); // default to 'upcoming'
  const [helpOpen, setHelpOpen] = useState(false);

  // Modals state
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const [cancelModalTrip, setCancelModalTrip] = useState(null); // trip object to cancel
  const [cancelReason, setCancelReason] = useState('Changement d’agenda');
  const [toastMessage, setToastMessage] = useState('');

  // Password visibility & form errors
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localFormError, setLocalFormError] = useState('');

  // Auth form inputs
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Account editing states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingForm, setBillingForm] = useState({
    billingName: user?.paymentBilling?.billingName || '',
    billingAddress: user?.paymentBilling?.billingAddress || '',
    vatNumber: user?.paymentBilling?.vatNumber || '',
  });

  const [newAddressModal, setNewAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ label: '', address: '', type: 'home' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    // Dynamically load Google Identity Services SDK
    const scriptId = 'google-gsi-client';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  // Filter trips by user account
  const userTrips = user?.email
    ? trips.filter((t) => !t.clientEmail || t.clientEmail.toLowerCase() === user.email.toLowerCase())
    : trips;
  const upcomingTrips = userTrips.filter((t) => t.status === 'upcoming');
  const pastTrips = userTrips.filter((t) => t.status === 'past');
  const cancelledTrips = userTrips.filter((t) => t.status === 'cancelled');

  // Listen for Google Auth popup response
  useEffect(() => {
    const handleAuthMessage = async (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'SELY_GOOGLE_AUTH_SUCCESS' && e.data?.user) {
        const res = await loginWithGoogle(e.data.user);
        if (res.success) {
          showToast(`Connecté avec Google (${e.data.user.email})`);
          setAuthModal(null);
        }
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalFormError('');
    clearAuthError();
    if (!loginForm.email || !loginForm.password) {
      setLocalFormError('Veuillez renseigner votre email et mot de passe.');
      return;
    }
    const res = await loginWithEmail(loginForm);
    if (res.success) {
      showToast('Bienvenue sur votre espace SELY');
      setAuthModal(null);
      setLoginForm({ email: '', password: '' });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLocalFormError('');
    clearAuthError();
    if (!registerForm.email || !registerForm.password || !registerForm.firstName) {
      setLocalFormError('Veuillez renseigner les champs obligatoires (*).');
      return;
    }
    if (registerForm.password.length < 6) {
      setLocalFormError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setLocalFormError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    const res = await registerUser(registerForm);
    if (res.success) {
      showToast('Compte SELY créé avec succès');
      setAuthModal(null);
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const handleConfirmCancelTrip = () => {
    if (!cancelModalTrip) return;
    cancelTrip(cancelModalTrip.id, cancelReason);
    setCancelModalTrip(null);
    showToast('Votre trajet a bien été annulé.');
    setActiveTab('cancelled');
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    updatePersonalInfo(personalForm);
    setIsEditingPersonal(false);
    showToast('Informations personnelles mises à jour');
  };

  const handleSaveBilling = (e) => {
    e.preventDefault();
    updatePaymentBilling(billingForm);
    setIsEditingBilling(false);
    showToast('Coordonnées de facturation enregistrées');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressForm.label || !newAddressForm.address) return;
    const updated = [
      ...(user?.frequentAddresses || []),
      {
        id: `addr_${Date.now()}`,
        label: newAddressForm.label,
        address: newAddressForm.address,
        type: newAddressForm.type,
      },
    ];
    updateFrequentAddresses(updated);
    setNewAddressModal(false);
    setNewAddressForm({ label: '', address: '', type: 'home' });
    showToast('Nouvelle adresse fréquente ajoutée');
  };

  const handleDeleteAddress = (id) => {
    const updated = (user?.frequentAddresses || []).filter((a) => a.id !== id);
    updateFrequentAddresses(updated);
    showToast('Adresse supprimée');
  };

  // Official invoice generator & downloader
  const handleDownloadInvoice = (trip) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      alert('Veuillez autoriser les fenêtres pop-up pour afficher votre facture.');
      return;
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <title>Facture SELY - ${trip.invoiceNumber || trip.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0 auto; max-width: 800px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 800; letter-spacing: 2px; }
          .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-top: 4px; }
          .company-info { font-size: 11px; color: #64748b; line-height: 1.6; text-align: right; }
          .client-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
          .invoice-title { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 12px; background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #475569; }
          td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .totals { margin-left: auto; width: 300px; margin-bottom: 40px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .totals-total { font-size: 18px; font-weight: 700; border-top: 2px solid #0f172a; padding-top: 10px; margin-top: 6px; }
          .footer { font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .print-btn { background: #0f172a; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-bottom: 20px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">Imprimer ou Enregistrer en PDF</button>
        <div class="header">
          <div>
            <div class="logo">SELY</div>
            <div class="subtitle">Service de Chauffeur Privé & Conciergerie</div>
          </div>
          <div class="company-info">
            <strong>AM AUTO / SELY PRIVÉ</strong><br />
            161 B Rue Emile Combes, 33270 Floirac – France<br />
            SIRET : 944 023 514 00010<br />
            TVA Intracommunautaire : FR63 944023514<br />
            direction@sely.pro • +33 1 84 80 56 76
          </div>
        </div>

        <div class="client-box">
          <div class="invoice-title">FACTURE N° ${trip.invoiceNumber || 'FACT-' + trip.id}</div>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">Date d’émission : ${trip.date} • Statut : <strong>ACQUITTÉE</strong></p>
          <div style="font-size: 13px;">
            <strong>Facturé à :</strong><br />
            ${user?.paymentBilling?.billingName || user?.name || 'Client Privé SELY'}<br />
            ${user?.paymentBilling?.billingAddress || 'Paris, France'}<br />
            ${user?.paymentBilling?.vatNumber ? 'TVA : ' + user.paymentBilling.vatNumber : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description de la prestation</th>
              <th>Date & Heure</th>
              <th>Véhicule</th>
              <th style="text-align: right;">Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${trip.serviceLabel || 'Transfert Chauffeur Privé'}</strong><br />
                <span style="font-size: 12px; color: #64748b;">De : ${trip.pickup}</span><br />
                <span style="font-size: 12px; color: #64748b;">Vers : ${trip.destination}</span>
              </td>
              <td>${trip.date} à ${trip.time}</td>
              <td>${trip.vehicleName}</td>
              <td style="text-align: right; font-weight: 700;">${trip.price}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Total HT</span><span>${(parseFloat(trip.price) * 0.909).toFixed(2)} €</span></div>
          <div class="totals-row"><span>TVA (10%)</span><span>${(parseFloat(trip.price) * 0.091).toFixed(2)} €</span></div>
          <div class="totals-row totals-total"><span>Total TTC Payé</span><span>${trip.price}</span></div>
        </div>

        <div class="footer">
          SELY Privé • Exploité par AM AUTO • Licence VTC registre ministériel EVTC • Assurance RC Professionnelle passagers illimitée AXA.<br />
          Règlement par carte bancaire sécurisée. Merci de votre confiance.
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const renderNoAccountCard = () => (
    <div className={styles.noAccountCard}>
      <div className={styles.noAccountBadge}>
        <User size={13} /> Espace Réservations
      </div>
      <h2 className={styles.noAccountTitle}>Aucun compte actuellement</h2>
      <p className={styles.noAccountText}>
        Connectez-vous pour consulter vos réservations et vos factures.
      </p>

      <div className={styles.authButtonGroup}>
        <button
          type="button"
          className={styles.primaryAuthBtn}
          onClick={() => {
            setAuthModal('login');
            setLocalFormError('');
            clearAuthError();
          }}
        >
          <User size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          Se connecter
        </button>

        <button
          type="button"
          className={styles.secondaryAuthBtn}
          onClick={() => {
            setAuthModal('register');
            setLocalFormError('');
            clearAuthError();
          }}
        >
          Créer un compte
        </button>
      </div>

      <div className={styles.noAccountBookLinkRow}>
        <span>Vous n'avez pas encore réservé ?</span>{' '}
        <Link to={getCityPath('/reserver')} className={styles.noAccountBookLink}>
          Réserver un trajet &rarr;
        </Link>
      </div>
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3000,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          fontSize: '0.9rem',
          fontWeight: 500,
        }}>
          {toastMessage}
        </div>
      )}

      {/* Blurred luxury background matching the main screen */}
      <div className={styles.voyagesBgImage} />
      <div className={styles.voyagesVignetteOverlay} />

      <div className={styles.innerContent}>
        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <h1 className={styles.mainTitle}>
            {currentView === 'account' ? 'Mon Compte' : 'Voyages'}
          </h1>

          {user ? (
            <button
              type="button"
              className={styles.accountSwitchBtn}
              onClick={() => setCurrentView(currentView === 'account' ? 'trips' : 'account')}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {user.firstName ? user.firstName.charAt(0) : 'U'}
                </div>
              )}
              <span>{currentView === 'account' ? 'Mes Voyages' : 'Mon Compte'}</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.accountSwitchBtn}
              onClick={() => setAuthModal('login')}
            >
              <User size={14} />
              <span>Se connecter</span>
            </button>
          )}
        </div>

        {currentView === 'account' && user ? (
          /* ── Case 1: MON COMPTE VIEW (4 SECTIONS) ── */
          <div>
            {/* User Profile Header */}
            <div className={styles.accountHeader}>
              <div className={styles.accountUserMeta}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.accountBigAvatar} />
                ) : (
                  <div className={styles.accountBigAvatar}>
                    {user.firstName ? user.firstName.charAt(0) : 'U'}
                  </div>
                )}
                <div>
                  <h2 className={styles.accountUserName}>{user.name || `${user.firstName} ${user.lastName}`}</h2>
                  <p className={styles.accountUserEmail}>{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.logoutBtn}
                style={{ width: 'auto', padding: '0.5rem 1rem' }}
                onClick={() => {
                  logout();
                  setCurrentView('trips');
                  showToast('Déconnexion réussie');
                }}
              >
                <LogOut size={16} /> Déconnexion
              </button>
            </div>

            {/* SECTION 1: Informations personnelles */}
            <div className={styles.accountSectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <User size={18} /> 1. Informations personnelles
                </h3>
                <button
                  type="button"
                  className={styles.sectionEditBtn}
                  onClick={() => {
                    setPersonalForm({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      company: user.company || '',
                    });
                    setIsEditingPersonal(!isEditingPersonal);
                  }}
                >
                  {isEditingPersonal ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {isEditingPersonal ? (
                <form onSubmit={handleSavePersonal} className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>Prénom</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={personalForm.firstName}
                      onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Nom</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={personalForm.lastName}
                      onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Adresse Email</label>
                    <input
                      type="email"
                      className={styles.formInput}
                      value={personalForm.email}
                      onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel}>Téléphone (Mobile)</label>
                    <input
                      type="tel"
                      className={styles.formInput}
                      value={personalForm.phone}
                      onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.formLabel}>Entreprise / Organisation</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={personalForm.company}
                      onChange={(e) => setPersonalForm({ ...personalForm, company: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroupFull} style={{ marginTop: '0.5rem' }}>
                    <button type="submit" className={styles.primaryAuthBtn}>
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.formGrid}>
                  <div>
                    <span className={styles.formLabel}>Prénom & Nom</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {user.firstName || user.name} {user.lastName || ''}
                    </div>
                  </div>
                  <div>
                    <span className={styles.formLabel}>Email</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.email}</div>
                  </div>
                  <div>
                    <span className={styles.formLabel}>Téléphone</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.phone || 'Non renseigné'}</div>
                  </div>
                  <div>
                    <span className={styles.formLabel}>Entreprise</span>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.company || 'Compte personnel'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Adresses fréquentes */}
            <div className={styles.accountSectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <MapPin size={18} /> 2. Adresses fréquentes
                </h3>
                <button
                  type="button"
                  className={styles.sectionEditBtn}
                  onClick={() => setNewAddressModal(true)}
                >
                  <Plus size={14} style={{ display: 'inline', marginRight: 4 }} /> Ajouter une adresse
                </button>
              </div>

              <div className={styles.addressList}>
                {(user.frequentAddresses || []).map((addr) => (
                  <div key={addr.id} className={styles.addressItem}>
                    <div className={styles.addressMeta}>
                      <MapPin size={16} color="#2563eb" />
                      <div>
                        <div className={styles.addressLabel}>{addr.label}</div>
                        <div className={styles.addressText}>{addr.address}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      title="Supprimer cette adresse"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Coordonnées de facturation */}
            <div className={styles.accountSectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <CreditCard size={18} /> 3. Coordonnées de facturation
                </h3>
                <button
                  type="button"
                  className={styles.sectionEditBtn}
                  onClick={() => {
                    setBillingForm({
                      billingName: user.paymentBilling?.billingName || user.name || '',
                      billingAddress: user.paymentBilling?.billingAddress || '',
                      vatNumber: user.paymentBilling?.vatNumber || '',
                    });
                    setIsEditingBilling(!isEditingBilling);
                  }}
                >
                  {isEditingBilling ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {isEditingBilling ? (
                <form onSubmit={handleSaveBilling} className={styles.formGrid}>
                  <div className={styles.formGroupFull}>
                    <label className={styles.formLabel}>Nom du titulaire / Raison Sociale</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={billingForm.billingName}
                      onChange={(e) => setBillingForm({ ...billingForm, billingName: e.target.value })}
                      required
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.formLabel}>Adresse de facturation</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={billingForm.billingAddress}
                      onChange={(e) => setBillingForm({ ...billingForm, billingAddress: e.target.value })}
                      placeholder="18 Place Vendôme, 75001 Paris"
                      required
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.formLabel}>Numéro de TVA Intracommunautaire (optionnel)</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={billingForm.vatNumber}
                      onChange={(e) => setBillingForm({ ...billingForm, vatNumber: e.target.value })}
                      placeholder="FR 32 948 201 023"
                    />
                  </div>
                  <div className={styles.formGroupFull} style={{ marginTop: '0.5rem' }}>
                    <button type="submit" className={styles.primaryAuthBtn}>
                      Enregistrer les coordonnées de facturation
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className={styles.formGrid}>
                    <div>
                      <span className={styles.formLabel}>Facturé au nom de</span>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        {user.paymentBilling?.billingName || user.name}
                      </div>
                    </div>
                    <div>
                      <span className={styles.formLabel}>Adresse de facturation</span>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>
                        {user.paymentBilling?.billingAddress || 'Non renseignée'}
                      </div>
                    </div>
                    {user.paymentBilling?.vatNumber && (
                      <div className={styles.formGroupFull}>
                        <span className={styles.formLabel}>Numéro de TVA Intracommunautaire</span>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                          {user.paymentBilling.vatNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: Informations légales */}
            <div className={styles.accountSectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <Shield size={18} /> 4. Informations légales & Déconnexion
                </h3>
              </div>

              <div className={styles.legalListItem}>
                <div>
                  <div className={styles.legalTitle}>Conditions Générales de Vente (CGV)</div>
                  <div className={styles.legalDesc}>Règles de réservation, forfaits d'attente aéroport et modalités d'annulation.</div>
                </div>
                <Link to={getCityPath('/mentions-legales')} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  Consulter
                </Link>
              </div>

              <div className={styles.legalListItem}>
                <div>
                  <div className={styles.legalTitle}>Politique de confidentialité (RGPD)</div>
                  <div className={styles.legalDesc}>Chiffrement de vos coordonnées et respect strict du secret des personnalités transportées.</div>
                </div>
                <Link to={getCityPath('/politique-de-confidentialite')} style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  Consulter
                </Link>
              </div>

              <div className={styles.legalListItem}>
                <div>
                  <div className={styles.legalTitle}>Licences VTC & Assurances Professionnelles</div>
                  <div className={styles.legalDesc}>Exploité par AM AUTO (SIRET : 944 023 514 00010) • Registre VTC ministériel • Assurance AXA illimitée.</div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>Certifié conforme</span>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={() => {
                    logout();
                    setCurrentView('trips');
                    showToast('Vous avez été déconnecté.');
                  }}
                >
                  <LogOut size={16} /> Déconnexion du compte
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Case 3: VOYAGES VIEW (À Venir, Passées, Annulé) ── */
          <div>
            {/* Tabs matching screenshot */}
            <div className={styles.tabsContainer}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'upcoming' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <span>À Venir</span>
                {activeTab === 'upcoming' && <div className={styles.tabIndicator} />}
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'past' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('past')}
              >
                <span>Passées</span>
                {activeTab === 'past' && <div className={styles.tabIndicator} />}
              </button>

              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'cancelled' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                <span>Annulé</span>
                {activeTab === 'cancelled' && <div className={styles.tabIndicator} />}
              </button>
            </div>

            {/* TAB CONTENT: À Venir */}
            {activeTab === 'upcoming' && (
              !user ? (
                renderNoAccountCard()
              ) : upcomingTrips.length === 0 ? (
                <div className={styles.emptyStateContainer}>
                  <div className={styles.emptyStateGraphic}>
                    <CarIllustration />
                  </div>
                    <h2 className={styles.emptyStateTitle}>Aucun trajet à venir</h2>
                    <p className={styles.emptyStateDesc}>
                      Vos prochaines réservations et transferts confirmés s'afficheront ici.
                    </p>
                    <Link to={getCityPath('/reserver')} className={styles.emptyBookCtaBtn}>
                      Réservez un voyage
                    </Link>
                  </div>
                ) : (
                  <div>
                    {upcomingTrips.map((trip) => (
                      <div key={trip.id} className={styles.tripCard}>
                        <div className={styles.tripCardHeader}>
                          <div className={styles.tripDateBadge}>
                            <Calendar size={16} color="#2563eb" />
                            <span>{trip.date} • {trip.time}</span>
                          </div>
                          <span className={`${styles.statusPill} ${styles.statusUpcoming}`}>
                            <CheckCircle2 size={12} /> Confirmé
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className={styles.routeTimeline}>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconPickup} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Prise en charge</div>
                              <div className={styles.pointAddress}>{trip.pickup}</div>
                            </div>
                          </div>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconDropoff} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Destination</div>
                              <div className={styles.pointAddress}>{trip.destination}</div>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle & Price */}
                        <div className={styles.tripMetaGrid}>
                          <div className={styles.vehicleInfo}>
                            <img
                              src={trip.vehicleImage || '/sclass-main-new.jpg'}
                              alt={trip.vehicleName}
                              className={styles.vehicleThumbnail}
                              onError={(e) => { e.currentTarget.src = '/eclass-paris-luxury.jpg'; }}
                            />
                            <div className={styles.vehicleDetails}>
                              <h4>{trip.vehicleName}</h4>
                              <div className={styles.vehicleCapacity}>
                                <span>{trip.passengers || 2} Passagers</span>
                                <span>•</span>
                                <span>{trip.luggage || 3} Bagages</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.tripPriceTag}>
                            <div className={styles.tripPriceLabel}>Tarif garanti</div>
                            <div className={styles.tripPriceValue}>{trip.price}</div>
                          </div>
                        </div>

                        {/* Chauffeur info if available */}
                        {trip.chauffeur && (
                          <div className={styles.chauffeurBanner}>
                            <div>
                              <span>Chauffeur dédié : </span>
                              <span className={styles.chauffeurName}>{trip.chauffeur}</span>
                            </div>
                            {trip.chauffeurPhone && (
                              <a href={`tel:${trip.chauffeurPhone}`} className={styles.chauffeurCallLink}>
                                <Phone size={13} /> {trip.chauffeurPhone}
                              </a>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className={styles.tripActions}>
                          <button
                            type="button"
                            className={styles.cancelTripBtn}
                            onClick={() => setCancelModalTrip(trip)}
                          >
                            Annuler le trajet
                          </button>
                          <Link to={getCityPath('/contact')} className={styles.rebookBtn}>
                            Contacter l'assistance
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}

            {/* TAB CONTENT: Passées */}
            {activeTab === 'past' && (
              !user ? (
                renderNoAccountCard()
              ) : pastTrips.length === 0 ? (
                <div className={styles.emptyStateContainer}>
                  <div className={styles.emptyStateGraphic}>
                    <CarIllustration />
                  </div>
                    <h2 className={styles.emptyStateTitle}>Aucun trajet passé</h2>
                    <p className={styles.emptyStateDesc}>
                      L'historique de vos déplacements et vos factures officielles apparaîtront ici.
                    </p>
                    <Link to={getCityPath('/reserver')} className={styles.emptyBookCtaBtn}>
                      Réservez un voyage
                    </Link>
                  </div>
                ) : (
                  <div>
                    {pastTrips.map((trip) => (
                      <div key={trip.id} className={styles.tripCard}>
                        <div className={styles.tripCardHeader}>
                          <div className={styles.tripDateBadge}>
                            <Calendar size={16} color="#64748b" />
                            <span>{trip.date} • {trip.time}</span>
                          </div>
                          <span className={`${styles.statusPill} ${styles.statusPast}`}>
                            Terminé
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className={styles.routeTimeline}>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconPickup} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Prise en charge</div>
                              <div className={styles.pointAddress}>{trip.pickup}</div>
                            </div>
                          </div>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconDropoff} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Destination</div>
                              <div className={styles.pointAddress}>{trip.destination}</div>
                            </div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className={styles.tripMetaGrid}>
                          <div className={styles.vehicleInfo}>
                            <img
                              src={trip.vehicleImage || '/vclass-paris-luxury.jpg'}
                              alt={trip.vehicleName}
                              className={styles.vehicleThumbnail}
                              onError={(e) => { e.currentTarget.src = '/eclass-paris-luxury.jpg'; }}
                            />
                            <div className={styles.vehicleDetails}>
                              <h4>{trip.vehicleName}</h4>
                              <div className={styles.vehicleCapacity}>
                                <span>Facture : {trip.invoiceNumber || 'FACT-' + trip.id}</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.tripPriceTag}>
                            <div className={styles.tripPriceLabel}>Montant TTC</div>
                            <div className={styles.tripPriceValue}>{trip.price}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.tripActions}>
                          <button
                            type="button"
                            className={styles.invoiceDownloadBtn}
                            onClick={() => handleDownloadInvoice(trip)}
                          >
                            <Download size={14} /> Télécharger la facture
                          </button>
                          <Link to={getCityPath('/reserver')} className={styles.rebookBtn}>
                            Réserver à nouveau
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}

            {/* TAB CONTENT: Annulé (matches reference screenshot) */}
            {activeTab === 'cancelled' && (
              <div>
                {cancelledTrips.length === 0 ? (
                  /* Matches screenshot media_1790590617904.png */
                  <div className={styles.emptyStateContainer}>
                    <div className={styles.emptyStateGraphic}>
                      <CarIllustration />
                    </div>
                    <h2 className={styles.emptyStateTitle}>Aucun trajet annulé</h2>
                    <p className={styles.emptyStateDesc}>
                      Les trajets annulés seront affichés ici.
                    </p>
                    <Link to={getCityPath('/reserver')} className={styles.emptyBookCtaBtn}>
                      Réservez un voyage
                    </Link>
                  </div>
                ) : (
                  <div>
                    {cancelledTrips.map((trip) => (
                      <div key={trip.id} className={styles.tripCard}>
                        <div className={styles.tripCardHeader}>
                          <div className={styles.tripDateBadge}>
                            <Calendar size={16} color="#991b1b" />
                            <span>{trip.date} • {trip.time}</span>
                          </div>
                          <span className={`${styles.statusPill} ${styles.statusCancelled}`}>
                            Annulé
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className={styles.routeTimeline}>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconPickup} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Départ initial</div>
                              <div className={styles.pointAddress}>{trip.pickup}</div>
                            </div>
                          </div>
                          <div className={styles.timelinePoint}>
                            <div className={styles.pointIconDropoff} />
                            <div className={styles.pointDetails}>
                              <div className={styles.pointLabel}>Destination initiale</div>
                              <div className={styles.pointAddress}>{trip.destination}</div>
                            </div>
                          </div>
                        </div>

                        {trip.cancelReason && (
                          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#991b1b', marginBottom: '1rem' }}>
                            <strong>Motif :</strong> {trip.cancelReason}
                          </div>
                        )}

                        <div className={styles.tripActions}>
                          <Link to={getCityPath('/reserver')} className={styles.rebookBtn}>
                            Réserver à nouveau
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Cancel Trip Modal ── */}
      <AnimatePresence>
        {cancelModalTrip && (
          <div className={styles.modalBackdrop} onClick={() => setCancelModalTrip(null)}>
            <motion.div
              className={styles.modalBox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Confirmer l'annulation</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setCancelModalTrip(null)}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Êtes-vous certain de vouloir annuler votre trajet du <strong>{cancelModalTrip.date}</strong> à <strong>{cancelModalTrip.time}</strong> ?
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className={styles.formLabel}>Motif de l'annulation</label>
                <select
                  className={styles.formInput}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Changement d’agenda">Changement d’agenda</option>
                  <option value="Vol / Train retardé ou annulé">Vol / Train retardé ou annulé</option>
                  <option value="Erreur lors de la réservation">Erreur lors de la réservation</option>
                  <option value="Autre motif personnel">Autre motif personnel</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className={styles.secondaryAuthBtn}
                  style={{ width: 'auto' }}
                  onClick={() => setCancelModalTrip(null)}
                >
                  Garder la réservation
                </button>
                <button
                  type="button"
                  className={styles.cancelTripBtn}
                  onClick={handleConfirmCancelTrip}
                >
                  Confirmer l'annulation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Add Frequent Address Modal ── */}
      <AnimatePresence>
        {newAddressModal && (
          <div className={styles.modalBackdrop} onClick={() => setNewAddressModal(false)}>
            <motion.div
              className={styles.modalBox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Ajouter une adresse fréquente</h3>
                <button type="button" className={styles.modalCloseBtn} onClick={() => setNewAddressModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddAddress}>
                <div style={{ marginBottom: '1rem' }}>
                  <label className={styles.formLabel}>Nom du lieu (ex: Bureau, Résidence secondaire, Hôtel Ritz)</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newAddressForm.label}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, label: e.target.value })}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label className={styles.formLabel}>Adresse complète</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={newAddressForm.address}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, address: e.target.value })}
                    placeholder="15 Place Vendôme, 75001 Paris"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className={styles.secondaryAuthBtn}
                    style={{ width: 'auto' }}
                    onClick={() => setNewAddressModal(false)}
                  >
                    Annuler
                  </button>
                  <button type="submit" className={styles.primaryAuthBtn} style={{ width: 'auto' }}>
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Login / Register Modal ── */}
      {typeof document !== 'undefined' && authModal && createPortal(
        <AnimatePresence>
          <div
            className={styles.modalBackdrop}
            onClick={() => {
              setAuthModal(null);
              setLocalFormError('');
              clearAuthError();
            }}
          >
            <motion.div
              className={styles.modalBox}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {authModal === 'login' ? 'Connexion à votre compte' : 'Créer votre compte SELY'}
                </h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => {
                    setAuthModal(null);
                    setLocalFormError('');
                    clearAuthError();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Error Banner */}
              {(localFormError || authError) && (
                <div className={styles.authErrorBanner}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{localFormError || authError}</span>
                </div>
              )}

              {authModal === 'login' ? (
                <div>
                  <form onSubmit={handleEmailLoginSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label className={styles.formLabel}>Adresse email</label>
                      <input
                        type="email"
                        name="email"
                        id="login-email"
                        autoComplete="username email"
                        className={styles.formInput}
                        value={loginForm.email}
                        onChange={(e) => {
                          setLoginForm({ ...loginForm, email: e.target.value });
                          if (localFormError || authError) {
                            setLocalFormError('');
                            clearAuthError();
                          }
                        }}
                        placeholder="client@domaine.com"
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label className={styles.formLabel}>Mot de passe</label>
                      <div className={styles.passwordWrapper}>
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          name="password"
                          id="login-password"
                          autoComplete="current-password"
                          className={`${styles.formInput} ${styles.inputWithToggle}`}
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, password: e.target.value });
                            if (localFormError || authError) {
                              setLocalFormError('');
                              clearAuthError();
                            }
                          }}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          className={styles.passwordToggleBtn}
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          aria-label="Afficher ou masquer le mot de passe"
                        >
                          {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className={styles.primaryAuthBtn}
                      style={{
                        marginBottom: '0.75rem',
                        width: '100%',
                        opacity: authLoading ? 0.75 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {authLoading && <Loader2 size={16} className={styles.authLoadingSpinner} />}
                      <span>{authLoading ? 'Connexion en cours...' : 'Se connecter'}</span>
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                      Pas encore de compte ?{' '}
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => {
                          setAuthModal('register');
                          setLocalFormError('');
                          clearAuthError();
                        }}
                      >
                        Créer un compte
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <div className={styles.formGrid} style={{ marginBottom: '1rem' }}>
                    <div>
                      <label className={styles.formLabel}>Prénom *</label>
                      <input
                        type="text"
                        name="given-name"
                        autoComplete="given-name"
                        className={styles.formInput}
                        value={registerForm.firstName}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, firstName: e.target.value });
                          if (localFormError || authError) {
                            setLocalFormError('');
                            clearAuthError();
                          }
                        }}
                        placeholder="Ex : Alexandre"
                        required
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>Nom</label>
                      <input
                        type="text"
                        name="family-name"
                        autoComplete="family-name"
                        className={styles.formInput}
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                        placeholder="Ex : Dupont"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className={styles.formLabel}>Adresse email *</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className={styles.formInput}
                      value={registerForm.email}
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, email: e.target.value });
                        if (localFormError || authError) {
                          setLocalFormError('');
                          clearAuthError();
                        }
                      }}
                      placeholder="votre.nom@domaine.com"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className={styles.formLabel}>Téléphone mobile</label>
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      className={styles.formInput}
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className={styles.formLabel}>Mot de passe (min. 6 caractères) *</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        name="new-password"
                        autoComplete="new-password"
                        className={`${styles.formInput} ${styles.inputWithToggle}`}
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          if (localFormError || authError) {
                            setLocalFormError('');
                            clearAuthError();
                          }
                        }}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        aria-label="Afficher ou masquer le mot de passe"
                      >
                        {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className={styles.formLabel}>Confirmer le mot de passe *</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirm-password"
                        autoComplete="new-password"
                        className={`${styles.formInput} ${styles.inputWithToggle}`}
                        value={registerForm.confirmPassword}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                          if (localFormError || authError) {
                            setLocalFormError('');
                            clearAuthError();
                          }
                        }}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Afficher ou masquer le mot de passe"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className={styles.primaryAuthBtn}
                    style={{
                      marginBottom: '0.75rem',
                      width: '100%',
                      opacity: authLoading ? 0.75 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {authLoading && <Loader2 size={16} className={styles.authLoadingSpinner} />}
                    <span>{authLoading ? "Création du compte..." : "Valider l'inscription"}</span>
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => {
                        setAuthModal('login');
                        setLocalFormError('');
                        clearAuthError();
                      }}
                    >
                      Se connecter
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* ── Help / Conciergerie Modal (Original Luxury Theme from Hero.jsx) ── */}
      <AnimatePresence>
        {helpOpen && (
          <div className={styles.modalBackdrop} onClick={() => setHelpOpen(false)}>
            <motion.div
              className={styles.modalBox}
              style={{
                maxWidth: '420px',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '1.75rem',
                color: '#0a0a0a',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader} style={{ marginBottom: '0.85rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif, "Cormorant Garamond", Georgia, serif)',
                    fontSize: '1.35rem',
                    fontWeight: 500,
                    color: '#0a0a0a',
                    margin: 0,
                  }}
                >
                  Assistance & Conciergerie VIP
                </h3>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', color: '#0a0a0a', cursor: 'pointer', padding: '0.35rem' }}
                  onClick={() => setHelpOpen(false)}
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontFamily: 'var(--font-sans, "Montserrat", sans-serif)', fontSize: '0.88rem', color: '#555555', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                Notre direction des opérations est à votre écoute 24h/24 et 7j/7.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href="https://wa.me/33184805676?text=Bonjour%20SELY%20Privé,%20je%20souhaite%20un%20renseignement%20sur%20un%20service."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    padding: '0.85rem 1rem',
                    background: '#0a0a0a',
                    color: '#ffffff',
                    border: '1px solid #0a0a0a',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-sans, "Montserrat", sans-serif)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Échanger sur WhatsApp</span>
                </a>

                <a
                  href="tel:+33184805676"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    padding: '0.85rem 1rem',
                    background: '#f4f4f5',
                    color: '#0a0a0a',
                    border: '1px solid #e4e4e7',
                    borderRadius: '6px',
                    fontFamily: 'var(--font-sans, "Montserrat", sans-serif)',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Phone size={16} />
                  <span>+33 1 84 80 56 76</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Mobile Floating Bottom Bar matching Screenshot (media_1790590617904.png) ── */}
      {!hideBottomNav && (
        <div className={styles.mobileBottomNav}>
          <div className={styles.mobileCapsuleBar}>
            <button
              type="button"
              className={styles.mobileCapsuleBtn}
              onClick={() => navigate(getCityPath('/'))}
            >
              <Home size={18} strokeWidth={2} />
              <span>Accueil</span>
            </button>

            <button
              type="button"
              className={`${styles.mobileCapsuleBtn} ${currentView === 'trips' ? styles.mobileActivePill : ''}`}
              onClick={() => setCurrentView('trips')}
            >
              <Car size={18} strokeWidth={2} />
              <span>Voyages</span>
            </button>

            <button
              type="button"
              className={styles.mobileCapsuleBtn}
              onClick={() => setHelpOpen(true)}
            >
              <MessageSquare size={18} strokeWidth={2} />
              <span>Aide</span>
            </button>
          </div>

          {/* Round blue FAB button matching screenshot */}
          <Link to={getCityPath('/reserver')} className={styles.mobileFabBookBtn} aria-label="Réserver un voyage">
            <Car size={22} strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Car Graphic matching the user's uploaded reference image ── */
function CarIllustration() {
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Background horizontal speed bars (red / salmon) */}
      <rect x="35" y="14" width="38" height="4.5" rx="2.25" fill="#f87171" opacity="0.8" />
      <rect x="30" y="22" width="46" height="4.5" rx="2.25" fill="#f87171" opacity="0.8" />
      <rect x="32" y="30" width="44" height="4.5" rx="2.25" fill="#f87171" opacity="0.8" />
      <rect x="36" y="38" width="36" height="4.5" rx="2.25" fill="#f87171" opacity="0.8" />

      {/* Front-view Car (soft slate blue) */}
      <path
        d="M26 40C26 32 30 26 38 24L44 18C46 16 54 16 56 18L62 24C70 26 74 32 74 40V48C74 51 72 53 69 53H67V60C67 62 65 64 63 64H59C57 64 55 62 55 60V53H45V60C45 62 43 64 41 64H37C35 64 33 62 33 60V53H31C28 53 26 51 26 48V40Z"
        fill="#93c5fd"
        opacity="0.9"
      />
      {/* Windshield */}
      <path
        d="M38 26L43 20H57L62 26C63 28 61 30 58 30H42C39 30 37 28 38 26Z"
        fill="#ffffff"
        opacity="0.85"
      />
      {/* Headlights */}
      <circle cx="34" cy="40" r="3.5" fill="#ffffff" />
      <circle cx="66" cy="40" r="3.5" fill="#ffffff" />
      {/* Grille bar */}
      <rect x="42" y="44" width="16" height="3" rx="1.5" fill="#1d4ed8" opacity="0.3" />
    </svg>
  );
}
