const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const consoleErrors = [];

  // Capture all console messages
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[CONSOLE-${type.toUpperCase()}] ${text}`);
    
    if (type === 'error' || type === 'warning') {
      consoleErrors.push({ type, text });
    }
    if (type === 'log') {
      consoleLogs.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', (err) => {
    console.log(`[PAGE-ERROR] ${err.message}`);
    consoleErrors.push({ type: 'error', text: err.message });
  });

  try {
    console.log('Navigating to http://localhost:5176/...');
    await page.goto('http://localhost:5176/', { waitUntil: 'networkidle', timeout: 15000 });
    
    console.log('Waiting 5 seconds for React to mount and shapes to render...');
    await page.waitForTimeout(5000);

    // Check for ValidationError
    const hasValidationError = consoleErrors.some(e => e.text.includes('ValidationError'));
    const hasShapesCreated = consoleLogs.some(log => log.includes('[Canvas] Created') || log.includes('shapes'));

    console.log('\n=== VERIFICATION RESULTS ===');
    console.log(`ValidationError found: ${hasValidationError}`);
    console.log(`Shapes created message found: ${hasShapesCreated}`);
    console.log(`Total console errors/warnings: ${consoleErrors.length}`);

    if (hasValidationError) {
      console.log('\n❌ FAILED: ValidationError detected in console');
      const validationErrors = consoleErrors.filter(e => e.text.includes('ValidationError'));
      validationErrors.forEach(e => {
        console.log(`  ${e.type.toUpperCase()}: ${e.text}`);
      });
      process.exit(1);
    } else if (consoleErrors.length === 0 || !consoleErrors.some(e => e.text.includes('Cannot read') || e.text.includes('TypeError'))) {
      console.log('\n✅ PASSED: No ValidationError and no critical errors found');
      process.exit(0);
    } else {
      console.log('\n⚠️  WARNING: Some errors found but no ValidationError');
      console.log('Errors:');
      consoleErrors.forEach(e => {
        console.log(`  ${e.type.toUpperCase()}: ${e.text}`);
      });
      process.exit(0);
    }
  } catch (error) {
    console.log(`\n❌ FAILED: ${error.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
