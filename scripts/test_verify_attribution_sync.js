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

  // Handle login if required
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('admin');
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await page.goto('http://localhost:5173/sely-office/reservations', { waitUntil: 'networkidle2' });
  }

  await new Promise(r => setTimeout(r, 600));

  console.log('2. Search Alexander Wright to find his booking row');
  const searchInput = await page.$('input[placeholder*="Rechercher client"]');
  if (searchInput) {
    await searchInput.type('Alexander');
    await new Promise(r => setTimeout(r, 400));
  }

  // Click Attribuer on Alexander's row
  const attribuerBtn = await page.$('button[title*="Attribuer"]');
  if (attribuerBtn) {
    await attribuerBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('3. In modal, click Sprinter category button');
  const sprinterCatBtn = await page.$('button[data-vehicle-cat="sprinter"]');
  if (sprinterCatBtn) {
    await sprinterCatBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_verify_1_sprinter_selected.png' });

  console.log('4. Click Enregistrer & Synchroniser Client');
  const saveBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Enregistrer & Synchroniser'));
  });
  if (saveBtn) {
    await saveBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_verify_2_table_updated.png' });

  console.log('5. Switch to mobile view and check /paris/voyages');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/paris/voyages', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // If not logged in, login with Google quick button
  const voyBtns = await page.$$('button');
  for (const b of voyBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Se connecter')) {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
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
  await page.screenshot({ path: '/Users/alpha/.gemini/antigravity/brain/52acb76c-d14d-47f5-aa7f-e4dac0368ed3/admin_verify_3_client_trip_sprinter.png' });

  await browser.close();
  console.log('Attribution test completed!');
})();
