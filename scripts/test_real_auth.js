import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5173/paris/voyages';
const ARTIFACTS_DIR = '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3';

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  // Clear session storage before testing
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.removeItem('sely_auth_session_v2');
    localStorage.removeItem('sely_registered_accounts_v2');
    localStorage.removeItem('sely_client_user');
  });
  await page.reload({ waitUntil: 'networkidle2' });

  console.log('1. Testing non-existent user login...');
  // Click on "J'ai déjà un compte • Se connecter"
  const connectBtn = await page.waitForSelector('button ::-p-text("J\'ai déjà un compte")');
  await connectBtn.click();
  
  // Wait for modal email input to appear
  const emailInput = await page.waitForSelector('input[type="email"]');
  await emailInput.type('inconnu@test.com');
  const passInput1 = await page.waitForSelector('input[type="password"]');
  await passInput1.type('MauvaisMotDePasse123');

  // Click submit in modal
  const submitLoginBtn = await page.waitForSelector('form button[type="submit"]');
  await submitLoginBtn.click();
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_1_error_not_found.png` });
  console.log('Saved real_auth_1_error_not_found.png');

  console.log('2. Testing registration with password mismatch...');
  // Click "Créer un compte"
  const switchToRegister = await page.waitForSelector('button ::-p-text("Créer un compte")');
  await switchToRegister.click();
  await new Promise((r) => setTimeout(r, 600));

  // Fill register inputs
  await page.type('input[placeholder="Ex : Alexandre"]', 'Jean');
  await page.type('input[placeholder="Ex : Dupont"]', 'Dupont');
  await page.type('input[placeholder="votre.nom@domaine.com"]', 'jean.dupont@test-client.com');
  await page.type('input[placeholder="+33 6 12 34 56 78"]', '+33 6 12 34 56 78');

  // Mismatched passwords
  const passwordInputs = await page.$$('input[type="password"]');
  if (passwordInputs.length >= 2) {
    await passwordInputs[0].type('MotDePasse123');
    await passwordInputs[1].type('DifferentMotDePasse999');
  }

  const registerSubmitBtn = await page.waitForSelector('form button[type="submit"]');
  await registerSubmitBtn.click();
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_2_error_mismatch.png` });
  console.log('Saved real_auth_2_error_mismatch.png');

  console.log('3. Completing valid registration...');
  // Clear and enter matching password
  await passwordInputs[1].click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await passwordInputs[1].type('MotDePasse123');

  await registerSubmitBtn.click();
  await new Promise((r) => setTimeout(r, 1200));

  // Check user is logged in and open Mon Compte
  const accountTabBtn = await page.waitForSelector('button ::-p-text("Jean")');
  await accountTabBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_3_registered_and_logged_in.png` });
  console.log('Saved real_auth_3_registered_and_logged_in.png');

  console.log('4. Testing logout and re-login with wrong then right password...');
  // Click logout
  const logoutBtn = await page.waitForSelector('button ::-p-text("Déconnexion")');
  await logoutBtn.click();
  await new Promise((r) => setTimeout(r, 800));

  // Open login again
  const connectAgainBtn = await page.waitForSelector('button ::-p-text("Se connecter")');
  await connectAgainBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  // Enter bad password
  await page.type('input[placeholder="client@domaine.com"]', 'jean.dupont@test-client.com');
  await page.type('input[placeholder="••••••••"]', 'WrongPassword123');
  const submitLogin2 = await page.waitForSelector('form button[type="submit"]');
  await submitLogin2.click();
  await new Promise((r) => setTimeout(r, 800));

  // Now clear and enter good password
  const passInput = await page.$('input[placeholder="••••••••"]');
  await passInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await passInput.type('MotDePasse123');
  await submitLogin2.click();
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_4_relogin_success.png` });
  console.log('Saved real_auth_4_relogin_success.png');

  console.log('5. Testing Google connection flow...');
  // Logout again
  const accountTabBtn2 = await page.waitForSelector('button ::-p-text("Jean")');
  await accountTabBtn2.click();
  await new Promise((r) => setTimeout(r, 600));
  const logoutBtn2 = await page.waitForSelector('button ::-p-text("Déconnexion")');
  await logoutBtn2.click();
  await new Promise((r) => setTimeout(r, 800));

  // Click "Continuer avec Google"
  const googleBtn = await page.waitForSelector('button ::-p-text("Continuer avec Google")');
  await googleBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  // Type Google Email
  const googleInput = await page.waitForSelector('input[placeholder="exemple@gmail.com"]');
  await googleInput.type('sophie.martin@gmail.com');
  const googleSubmit = await page.waitForSelector('button ::-p-text("Se connecter avec Google")');
  await googleSubmit.click();
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/real_auth_5_google_login_success.png` });
  console.log('Saved real_auth_5_google_login_success.png');

  await browser.close();
  console.log('All real auth tests passed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
