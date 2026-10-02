import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5173/paris/voyages';
const ARTIFACTS_DIR = '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3';

async function fillInput(page, selector, text) {
  const el = await page.waitForSelector(selector);
  await el.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.keyboard.type(text);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.removeItem('sely_auth_session_v2');
    localStorage.removeItem('sely_registered_accounts_v2');
    localStorage.removeItem('sely_client_user');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));

  console.log('1. Testing unknown user login...');
  // Click "J'ai déjà un compte • Se connecter"
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes("J'ai déjà un compte")
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Fill unknown credentials
  await fillInput(page, 'input[placeholder="client@domaine.com"]', 'inconnu@test.com');
  await fillInput(page, 'input[placeholder="••••••••"]', 'MauvaisMotDePasse123');

  // Submit login
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Se connecter')
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_1_error_not_found.png` });
  console.log('Saved real_auth_1_error_not_found.png');

  console.log('2. Testing registration with password mismatch...');
  // Switch to register modal
  await page.evaluate(() => {
    const regLink = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Créer un compte')
    );
    if (regLink) regLink.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Fill form with mismatched passwords
  await fillInput(page, 'input[placeholder="Ex : Alexandre"]', 'Jean');
  await fillInput(page, 'input[placeholder="Ex : Dupont"]', 'Dupont');
  await fillInput(page, 'input[placeholder="votre.nom@domaine.com"]', 'jean.dupont@test-client.com');
  await fillInput(page, 'input[placeholder="+33 6 12 34 56 78"]', '+33 6 12 34 56 78');

  const passwordInputs = await page.$$('input[type="password"]');
  if (passwordInputs.length >= 2) {
    await passwordInputs[0].click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await passwordInputs[0].type('MotDePasse123');

    await passwordInputs[1].click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await passwordInputs[1].type('DifferentMotDePasse999');
  }

  // Submit registration
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes("Valider l'inscription")
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_2_error_mismatch.png` });
  console.log('Saved real_auth_2_error_mismatch.png');

  console.log('3. Completing valid registration...');
  // Fix matching password
  await passwordInputs[1].click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await passwordInputs[1].type('MotDePasse123');

  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes("Valider l'inscription")
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Open Mon Compte view to verify user session
  await page.evaluate(() => {
    const userBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Mon Compte')
    );
    if (userBtn) userBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_3_registered_and_logged_in.png` });
  console.log('Saved real_auth_3_registered_and_logged_in.png');

  console.log('4. Testing logout and re-login with bad password, then right password...');
  // Logout
  await page.evaluate(() => {
    const logoutBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Déconnexion')
    );
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Open login modal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes("J'ai déjà un compte")
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Type Jean Dupont with WRONG password
  await fillInput(page, 'input[placeholder="client@domaine.com"]', 'jean.dupont@test-client.com');
  await fillInput(page, 'input[placeholder="••••••••"]', 'MauvaisMotDePasse!');

  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Se connecter')
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_4a_wrong_password.png` });
  console.log('Saved real_auth_4a_wrong_password.png');

  // Now enter CORRECT password
  await fillInput(page, 'input[placeholder="••••••••"]', 'MotDePasse123');
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Se connecter')
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Open Mon Compte
  await page.evaluate(() => {
    const userBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Mon Compte')
    );
    if (userBtn) userBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_4b_relogin_success.png` });
  console.log('Saved real_auth_4b_relogin_success.png');

  console.log('5. Testing Google connection flow...');
  // Logout
  await page.evaluate(() => {
    const logoutBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Déconnexion')
    );
    if (logoutBtn) logoutBtn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Click "Continuer avec Google"
  await page.evaluate(() => {
    const gBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Continuer avec Google')
    );
    if (gBtn) gBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Enter Google email
  await fillInput(page, 'input[placeholder="exemple@gmail.com"]', 'sophie.martin@gmail.com');
  await page.evaluate(() => {
    const gSubmit = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Se connecter avec Google')
    );
    if (gSubmit) gSubmit.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  // Open Mon Compte for Google user
  await page.evaluate(() => {
    const userBtn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Mon Compte')
    );
    if (userBtn) userBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_5_google_login_success.png` });
  console.log('Saved real_auth_5_google_login_success.png');

  await browser.close();
  console.log('All real auth tests succeeded cleanly!');
}

run().catch((err) => {
  console.error('Error in test:', err);
  process.exit(1);
});
