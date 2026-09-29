import { getFormAccessKey } from '../lib/formRouting';

/**
 * Service d'envoi d'emails de notification pour SELY Privé.
 * Envoie un email automatique à direction@sely.pro lors des événements clés :
 * 1. Quand un client demande le rattachement d'une réservation.
 * 2. Quand une réservation est rattachée avec succès à un compte client.
 */
export const notificationEmailService = {
  /**
   * Notification envoyée quand une réservation est reliée au compte d'un client
   */
  async notifyBookingLinked({ claimReq, booking }) {
    const payload = {
      access_key: getFormAccessKey(),
      subject: `✅ Réservation #${(booking?.id || '').slice(-6)} rattachée au compte de ${claimReq.clientName} - SELY`,
      from_name: 'SELY Système - Rattachement',
      'Type d’événement': 'Rattachement de réservation à un compte client',
      'Client (Bénéficiaire)': `${claimReq.clientName} (${claimReq.clientEmail})`,
      'Téléphone client': claimReq.clientPhone || booking?.phone || 'Non renseigné',
      'Identifiant course': booking?.id || '—',
      'Date & Heure prise en charge': `${booking?.date || '—'} à ${booking?.time || '—'}`,
      'Prestation': booking?.serviceType === 'hourly' ? 'Mise à disposition' : 'Transfert Point A à B',
      'Véhicule attribué': booking?.vehicle || booking?.vehicleCategory || '—',
      'Lieu de départ': booking?.pickup || '—',
      'Destination': booking?.destination || '—',
      'Tarif TTC': `${booking?.amount || 0} €`,
      'Mode de règlement': booking?.paymentMethod || 'Paiement externe',
      'Chauffeur assigné': booking?.chauffeur ? `${booking.chauffeur} (${booking.chauffeurPhone || 'Sans tél'})` : 'Non assigné',
      'Précisions client': claimReq.details || 'Aucune précision',
      'Date & heure du rattachement': new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      'Destinataire': 'direction@sely.pro',
    };

    return this.send(payload);
  },

  /**
   * Notification envoyée quand un client soumet une demande de rattachement
   */
  async notifyClaimSubmitted({ clientName, clientEmail, clientPhone, details }) {
    const payload = {
      access_key: getFormAccessKey(),
      subject: `🔔 Demande de rattachement de réservation reçue - ${clientName}`,
      from_name: 'SELY Conciergerie - Demande Client',
      'Type d’événement': 'Nouvelle demande de rattachement de réservation',
      'Client (Nom)': clientName,
      'Email du compte client': clientEmail,
      'Téléphone': clientPhone || 'Non renseigné',
      'Détails de la course (WhatsApp / Tel)': details || 'Aucune précision indiquée',
      'Date de la demande': new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      'Lien vers SELY Office': 'https://www.selyprive.com/admin/reservations',
      'Destinataire': 'direction@sely.pro',
    };

    return this.send(payload);
  },

  /**
   * Envoi résilient avec double tentative (API interne serverless + Web3Forms direct)
   */
  async send(payload) {
    // 1. Tenter via l'API serverless interne /api/send-notification
    try {
      const apiRes = await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (apiRes.ok) {
        return { success: true };
      }
    } catch (e) {
      // API locale indisponible (ex: dev vite sans backend), passer au direct
    }

    // 2. Tenter en direct via Web3Forms (autorisé sur le domaine de production selyprive.com)
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return { success: true };
      }
    } catch (err) {
      console.warn('[Notification Email] Échec de l’envoi de la notification :', err);
    }

    return { success: false };
  },
};
