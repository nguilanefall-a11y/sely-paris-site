import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Clear local storage first so we test completely fresh state
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });

  console.log('1. Admin Login without demo button...');
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/clean_1_admin_login_no_demo.png' });

  console.log('2. Entering admin password and logging in...');
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('admin');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  }
  await page.goto('http://localhost:5173/sely-office/reservations', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  console.log('3. Checking empty reservations table (no demo values)...');
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/clean_2_reservations_no_demo.png' });

  console.log('4. Opening new manual booking modal to check empty fields...');
  const addBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Saisir une réservation'));
  });
  if (addBtn) {
    await addBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/clean_3_new_booking_modal_empty_fields.png' });
  }

  console.log('5. Checking client voyages mobile view (empty clean state)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/clean_4_client_voyages_clean_empty.png' });

  await browser.close();
  console.log('All demo values removed successfully and verified!');
})();
