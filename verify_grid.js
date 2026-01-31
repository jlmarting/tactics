const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8001');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(2000); // Wait for engine to start
  await page.screenshot({ path: 'verification/grid_infinite.png' });

  // Test folding help panel
  await page.click('#toggle-info');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/help_folded.png' });

  await browser.close();
})();
