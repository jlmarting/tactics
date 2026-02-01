const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:8002');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(2000); // Wait for engine to start

    // No debug mode (default)
    await page.screenshot({ path: '/home/jules/verification/no_debug.png' });

    // Toggle debug mode
    await page.click('#toggle-side'); // Open side panel
    await page.waitForTimeout(500);
    await page.click('#debug'); // Click debug checkbox
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/jules/verification/debug_active.png' });

    // Test folding help panel
    await page.click('#toggle-info');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/home/jules/verification/help_folded.png' });

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
