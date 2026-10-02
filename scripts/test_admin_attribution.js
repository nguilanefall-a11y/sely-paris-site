import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1. Navigating to /admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step1_login.png' });

  console.log('2. Logging in with password admin...');
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('admin');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  }
  await page.goto('http://localhost:5173/sely-office/reservations', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step2_reservations_5types.png' });

  console.log('3. Clicking Attribuer on Alexander Wright booking...');
  // Find button with text 'Attribuer'
  const attribuerButtons = await page.$$('button');
  for (const b of attribuerButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Attribuer')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step3_attribuer_modal.png' });

  console.log('4. Selecting XL category in modal and saving...');
  const catButtons = await page.$$('button');
  for (const b of catButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim().startsWith('XL')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 400));
  // Click 'Enregistrer & Synchroniser Client'
  const allModalButtons = await page.$$('button');
  for (const b of allModalButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Enregistrer & Synchroniser')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step4_saved_in_table.png' });

  console.log('5. Navigating to /paris/voyages to check client sync...');
  await page.setViewport({ width: 390, height: 844 }); // Mobile viewport for client
  await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // If not logged in, log in with Google quick login
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Se connecter')) {
      await b.click();
      await new Promise(r => setTimeout(r, 600));
      // In modal, click Continuer avec Google
      const modalButtons = await page.$$('button');
      for (const mb of modalButtons) {
        const mtext = await page.evaluate(el => el.textContent, mb);
        if (mtext && mtext.includes('Continuer avec Google')) {
          await mb.click();
          break;
        }
      }
      break;
    }
  }

  await new Promise(r => setTimeout(r, 1000));

  // Click on 'À Venir' tab
  const tabButtons = await page.$$('button');
  for (const b of tabButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('À Venir')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step5_client_synced_view.png' });

  await browser.close();
  console.log('Finished testing successfully!');
})();
