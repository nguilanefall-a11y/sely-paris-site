import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1. Go to /sely-office/reservations');
  await page.goto('http://localhost:5173/sely-office/reservations', { waitUntil: 'networkidle2' });

  // If redirected to login, login
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('admin');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await page.goto('http://localhost:5173/sely-office/reservations', { waitUntil: 'networkidle2' });
  }

  await new Promise(r => setTimeout(r, 600));

  console.log('2. Click + Saisir une réservation manuelle');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('+ Saisir une réservation')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  console.log('3. Pick Sprinter category in new reservation modal');
  const modalBtns = await page.$$('button');
  for (const b of modalBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim().startsWith('Sprinter')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step6_sprinter_modal.png' });

  console.log('4. Submit new Sprinter booking for Alexander Wright');
  const allBtns = await page.$$('button');
  for (const b of allBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Enregistrer & Synchroniser Client')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));

  console.log('5. Check Client Voyages on mobile');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // If Se connecter is visible, click it and login with Google
  const voyBtns = await page.$$('button');
  for (const b of voyBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Se connecter')) {
      await b.click();
      await new Promise(r => setTimeout(r, 500));
      const mBtns = await page.$$('button');
      for (const mb of mBtns) {
        const mtext = await page.evaluate(el => el.textContent, mb);
        if (mtext && mtext.includes('Continuer avec Google')) {
          await mb.click();
          break;
        }
      }
      break;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  // Click À Venir
  const tabBtns = await page.$$('button');
  for (const b of tabBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('À Venir')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_5v_step7_client_sprinter_synced.png' });

  await browser.close();
  console.log('Done!');
})();
