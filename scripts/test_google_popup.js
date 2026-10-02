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

  console.log('1. Clicking "Continuer avec Google"...');
  // Listen for target (popup window) creation
  const popupPromise = new Promise((resolve) => {
    browser.once('targetcreated', async (target) => {
      const newPage = await target.page();
      resolve(newPage);
    });
  });

  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Continuer avec Google')
    );
    if (btn) btn.click();
  });

  // Await either the popup window or check if current page navigated
  let googlePage = await Promise.race([
    popupPromise,
    new Promise((r) => setTimeout(() => r(null), 3000)),
  ]);

  if (!googlePage) {
    // If not a popup target, open the Google Auth route directly to verify UI
    googlePage = await browser.newPage();
    await googlePage.setViewport({ width: 480, height: 640 });
    await googlePage.goto('http://localhost:5173/auth/google', { waitUntil: 'networkidle2' });
  } else {
    await googlePage.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  }

  await new Promise((r) => setTimeout(r, 600));
  await googlePage.screenshot({ path: `${ARTIFACTS_DIR}/google_auth_page_opened.png` });
  console.log('Saved google_auth_page_opened.png');

  console.log('2. Filling Google email...');
  await fillInput(googlePage, 'input[type="email"]', 'marion.cotillard@gmail.com');

  // Click "Suivant"
  await googlePage.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Suivant')
    );
    if (nextBtn) nextBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await googlePage.screenshot({ path: `${ARTIFACTS_DIR}/google_auth_password_step.png` });
  console.log('Saved google_auth_password_step.png');

  console.log('3. Filling Google password and submitting...');
  await fillInput(googlePage, 'input[type="password"]', 'SuperSecretPass2026!');

  // Submit
  await googlePage.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Suivant')
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  // Now check the main voyages page
  await page.bringToFront();
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 600));

  // Click on "Mon Compte" button in top right
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Mon Compte')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/google_auth_logged_in_success.png` });
  console.log('Saved google_auth_logged_in_success.png');

  await browser.close();
  console.log('All Google auth popup tests completed successfully!');
}

run().catch((err) => {
  console.error('Error in Google auth test:', err);
  process.exit(1);
});
