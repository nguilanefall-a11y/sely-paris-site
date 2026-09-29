const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3';

async function run() {
  console.log('🚀 Starting Claim Booking Sync Workflow E2E Test...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Step 1: Open site and seed a booking in admin
    console.log('--- Step 1: Initialize existing booking in Admin ---');
    await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      // Authenticate admin session
      localStorage.setItem('sely-auth-storage', JSON.stringify({ state: { isAuthenticated: true }, version: 0 }));

      // Seed a manual booking
      const existing = localStorage.getItem('sely_admin_bookings');
      let bookings = existing ? JSON.parse(existing) : [];
      if (!bookings.some(b => b.id === 'res_test_12345')) {
        bookings = [{
          id: 'res_test_12345',
          createdAt: new Date().toISOString(),
          status: 'paid',
          source: 'manual_admin',
          clientName: 'Client WhatsApp Externe',
          email: 'whatsapp_pending@sely.fr',
          phone: '+33 6 99 88 77 66',
          serviceType: 'transfer',
          date: '2026-10-15',
          time: '14:30',
          city: 'paris',
          pickup: 'Hôtel de Crillon, 10 Place de la Concorde, Paris',
          destination: 'Aéroport Paris-Charles de Gaulle (CDG) Terminal 2E',
          vehicle: 'First Class (Mercedes Classe S)',
          vehicleCategory: 'First Class',
          amount: 250,
          paymentMethod: 'Virement / WhatsApp',
          passengers: 2,
          luggage: 2,
          chauffeur: 'Karim B.',
          chauffeurPhone: '+33 6 01 02 03 04',
        }, ...bookings];
        localStorage.setItem('sely_admin_bookings', JSON.stringify(bookings));
      }
    });

    // Step 2: Navigate to client Voyages page
    console.log('--- Step 2: Open Client Voyages Page & Register Real Account ---');
    await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Click "Créer un compte" on the page
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Créer un compte'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Fill registration form using page.type for React controlled components
    console.log('Filling client registration form...');
    const testEmail = `alexandre.${Date.now()}@testclient.fr`;

    await page.waitForSelector('input[placeholder*="Alexandre"]');
    await page.type('input[placeholder*="Alexandre"]', 'Alexandre');
    await page.type('input[placeholder*="Dupont"]', 'Dupont');
    await page.type('input[placeholder*="votre.nom@domaine.com"]', testEmail);
    await page.type('input[placeholder*="+33"]', '+33 6 12 34 56 78');

    const pwdInputs = await page.$$('input[type="password"]');
    if (pwdInputs[0]) await pwdInputs[0].type('Securite123!');
    if (pwdInputs[1]) await pwdInputs[1].type('Securite123!');

    await new Promise((r) => setTimeout(r, 400));

    // Submit registration
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes("Valider l'inscription"));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Step 3: Check discreet claim button
    console.log('--- Step 3: Verify Discreet Claim Button ---');
    const claimBtnSelector = 'button[class*="claimBookingDiscreetBtn"]';
    await page.waitForSelector(claimBtnSelector, { timeout: 6000 });
    const btnText = await page.$eval(claimBtnSelector, (el) => el.textContent);
    console.log('Found discreet button with text:', btnText.trim());

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_1_discreet_btn_visible.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_1_discreet_btn_visible.png');

    // Step 4: Click discreet button and open modal
    console.log('--- Step 4: Open Claim Modal ---');
    await page.evaluate((sel) => {
      const btn = document.querySelector(sel);
      if (btn) btn.click();
    }, claimBtnSelector);
    await new Promise((r) => setTimeout(r, 600));

    // Fill the claim form
    console.log('Filling claim form details...');
    await page.waitForSelector('input[placeholder*="WhatsApp"]');
    await page.type('input[placeholder*="WhatsApp"]', 'Course réservée sur WhatsApp le 15 octobre vers CDG.');
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_2_modal_open.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_2_modal_open.png');

    // Submit the claim
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = buttons.find(b => b.textContent.includes('Envoyer la demande') || b.textContent.includes('Transmettre'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_3_submitted_confirmation.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_3_submitted_confirmation.png');

    // Step 5: Switch to Admin and check Claim Requests
    console.log('--- Step 5: Admin Dashboard - View Claim Requests ---');
    await page.goto('http://localhost:5173/admin/reservations', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // If redirected to login, log in
    const pwdInput = await page.$('input[placeholder*="administrateur"]');
    if (pwdInput) {
      console.log('Logging in to SELY Office...');
      await pwdInput.type('selyprive');
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.querySelector('button[type="submit"]')?.click();
      });
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Check that the alert banner is visible
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_4_admin_alert_banner.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_4_admin_alert_banner.png');

    // Click "Demandes de rattachement" tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Demandes de rattachement'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_5_admin_claims_list.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_5_admin_claims_list.png');

    // Step 6: Click "Relier à une course"
    console.log('--- Step 6: Link Claim to an existing course ---');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Relier à une course'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_6_linking_modal.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_6_linking_modal.png');

    // Click "Connecter à ce client" in modal
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Connecter à ce client'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_7_admin_linked_status.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_7_admin_linked_status.png');

    // Step 7: Go back to Client Voyages Page and verify the trip is visible!
    console.log('--- Step 7: Verify Trip appears on Client Voyages Page ---');
    await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_8_client_voyages_with_trip.png'), fullPage: false });
    console.log('Saved screenshot: test_claim_8_client_voyages_with_trip.png');

    // Verify trip card exists
    const tripCardsCount = await page.evaluate(() => {
      return document.querySelectorAll('div[class*="tripCard"]').length;
    });
    console.log('Number of trip cards visible for Alexandre Dupont:', tripCardsCount);

    if (tripCardsCount > 0) {
      console.log('🎉 SUCCESS! The trip was linked by the Admin and immediately rendered in the client account!');
    } else {
      console.warn('⚠️ Warning: No trip cards found on client account.');
    }

  } catch (err) {
    console.error('❌ Error during test:', err);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_claim_error.png'), fullPage: false });
  } finally {
    await browser.close();
  }
}

run();
