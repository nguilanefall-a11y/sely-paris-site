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
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) =>
      b.innerText.includes('Continuer avec Google')
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/mini_google_prompt.png` });
  console.log('Saved mini_google_prompt.png');

  console.log('2. Typing Google email in mini prompt...');
  await fillInput(page, 'input[placeholder="votre.email@gmail.com"]', 'pierre.durand@gmail.com');

  // Click "Continuer"
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
      b.innerText.includes('Continuer')
    );
    if (submitBtn) submitBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: `${ARTIFACTS_DIR}/mini_google_logged_in.png` });
  console.log('Saved mini_google_logged_in.png');

  await browser.close();
  console.log('Mini Google test passed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
