import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const coverage = JSON.parse(readFileSync('public/coverage.json', 'utf8'));
test.beforeEach(async ({ page }) => {
  await page.goto('/gallery.html');
  await expect(page.locator('html')).toHaveAttribute('data-catalogue-ready', 'true');
});

test('all audited component samples render without asset/runtime errors and utilities still win', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    // Upstream alpha.1 Combobox creates Menu on the same element; Bootstrap's
    // own registry logs this message. Do not suppress unrelated console errors.
    if (message.type() === 'error' && message.text() !== "Bootstrap doesn't allow more than one instance per element. Bound instance: bs.combobox.") errors.push(message.text());
  });
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-catalogue-ready', 'true');
  for (const sample of new Set([...coverage.styles, ...coverage.plugins].map(item => item.sample))) await expect(page.locator(`#${sample}`)).toBeVisible();
  for (const { selector } of coverage.styles) expect(await page.locator(selector).count(), selector).toBeGreaterThan(0);
  await expect(page.locator('#utility-hidden')).toHaveCSS('display', 'none');
  await expect(page.locator('#utility-grid')).toHaveCSS('display', 'grid');
  await expect(page.locator('#check-disabled')).toBeDisabled();
  await expect(page.getByRole('switch', { name: 'Disabled switch' })).toBeDisabled();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { message: `Overflow at ${width}px` }).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1120 });
  await page.locator('#new-forms').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `evidence/${testInfo.project.name}/catalogue-desktop.png` });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator('#new-forms').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `evidence/${testInfo.project.name}/catalogue-mobile.png` });
  expect(errors).toEqual([]);
});

test('searchable and multiple comboboxes handle selection, empty state, and Escape', async ({ page }) => {
  await page.locator('#browser-picker').click();
  await page.getByRole('textbox', { name: 'Search browsers' }).fill('zzzzzz');
  await expect(page.getByText('No browsers found.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search browsers' }).fill('mosaic');
  await page.locator('#sample-combobox .menu-item').filter({ hasText: 'NCSA Mosaic' }).click();
  await expect(page.locator('#browser-picker')).toContainText('NCSA Mosaic');
  await expect(page.locator('input[name="browser"]')).toHaveValue('mosaic');
  await page.locator('#multi-picker').click();
  await page.locator('#multi-picker + .menu').getByText('Space', { exact: true }).click();
  await page.locator('#multi-picker + .menu').getByText('Cats', { exact: true }).click();
  await expect(page.locator('#multi-picker')).toContainText('2 selected');
  await expect(page.locator('#multi-picker + .menu .selected')).toHaveCount(2);
  await page.keyboard.press('Escape');
  await expect(page.locator('#multi-picker + .menu')).not.toBeVisible();
});

test('chip input adds, rejects duplicate entries, and removes tags', async ({ page }) => {
  const input = page.locator('#interests');
  await input.fill('Space');
  await input.press('Enter');
  await input.fill('Space');
  await input.press('Enter');
  await expect(page.locator('#tag-picker .chip')).toHaveCount(1);
  await page.locator('#tag-picker .chip-dismiss').click();
  await expect(page.locator('#tag-picker .chip')).toHaveCount(0);
});

test('calendar popup and inline range keep real date selections', async ({ page }) => {
  await page.locator('#web-date').click();
  const popup = page.locator('[data-vc="calendar"][data-vc-input]');
  await expect(popup).toBeVisible();
  await popup.locator('[data-vc-date="2026-10-28"]').click();
  await expect(page.locator('#web-date')).toHaveValue(/28/);
  const inline = page.locator('#inline-calendar');
  await inline.locator('[data-vc-date="2026-10-20"]').click();
  await inline.locator('[data-vc-date="2026-10-22"]').click();
  await expect(page.locator('#trip-dates')).toHaveValue(/2026-10-20.*2026-10-22/);
});

test('OTP, both strength meters, and range controls update', async ({ page }) => {
  await page.locator('#verification-code').fill('123456');
  await expect(page.locator('#code-control .otp-slot')).toHaveCount(6);
  await expect(page.locator('#otp-status')).toContainText('complete');
  await page.locator('#demo-password').fill('BigRetro!Web2026###Long');
  await expect(page.locator('#password-strength')).toHaveAttribute('data-bs-strength', 'strong');
  await expect(page.locator('#password-strength .strength-segment.active')).toHaveCount(4);
  await page.locator('#bar-password').fill('BigRetro!Web2026###Long');
  await expect(page.locator('.strength-bar')).toHaveAttribute('data-bs-strength', 'strong');
  await expect(page.locator('.strength-bar')).toHaveCSS('--bs-strength-width', '100%');
  await page.locator('#volume').fill('80');
  await expect(page.locator('#range-status')).toHaveText('Volume: 80%');
  expect(await page.locator('#volume').evaluate(element => getComputedStyle(element.parentElement).getPropertyValue('--bs-range-fill').trim())).toBe('0.8');
});

test('button variants, toggles, checks, switches, stepper, and pagination retain their states', async ({ page }) => {
  await expect(page.locator('#button-variants .btn-outline')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('#button-variants .btn-subtle')).not.toHaveCSS('background-color', 'rgb(192, 192, 192)');
  await page.locator('#toggle-button').click();
  await expect(page.locator('#toggle-button')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#toggler-button').click();
  await expect(page.locator('#toggler-button')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#check-on').uncheck();
  await expect(page.locator('#check-on')).not.toBeChecked();
  await page.locator('#radio-two').check();
  await expect(page.locator('#radio-one')).not.toBeChecked();
  await page.getByRole('switch', { name: 'Pretend MIDI soundtrack' }).uncheck();
  await expect(page.locator('#music-switch')).not.toBeChecked();
  await page.locator('#advance-step').click();
  await expect(page.locator('#stepper-status')).toHaveText('Step 2: Create.');
  await page.locator('.pagination').getByRole('button', { name: '2', exact: true }).click();
  await expect(page.locator('#pagination-status')).toHaveText('Showing page 2 of 3.');
  await page.locator('#floating-email').fill('webmaster@example.test');
  await expect(page.locator('label[for="floating-email"]')).not.toHaveCSS('transform', 'none');
  await expect(page.locator('label[for="floating-select"]')).not.toHaveCSS('transform', 'none');
});

test('responsive overflow, nested menus, collapse, and tabs work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator('#overflow-nav .nav-overflow-toggle')).toBeVisible();
  await page.locator('#overflow-nav .nav-overflow-toggle').click();
  await expect(page.locator('#overflow-nav .nav-overflow-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open nested menu' }).click();
  await page.getByRole('button', { name: 'More destinations' }).click();
  await expect(page.locator('.submenu .menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Show links', exact: true }).click();
  await expect(page.locator('#catalogue-nav')).toBeVisible();
  await page.getByRole('button', { name: 'Show hidden message' }).click();
  await expect(page.locator('#collapse-sample')).toBeVisible();
  await page.getByRole('tab', { name: 'Links', exact: true }).click();
  await expect(page.locator('#catalogue-second')).toBeVisible();
  await page.locator('#sample-stepper summary').first().click();
  await expect(page.getByText('Use Bootstrap’s native details markup. No plugin required.')).toBeVisible();
});

test('scrollspy tracks a locally scrollable region', async ({ page }) => {
  await page.locator('#spy-content').scrollIntoViewIfNeeded();
  await page.locator('#spy-content').evaluate(element => { element.scrollTop = 400; });
  await expect(page.locator('#spy-nav a[href="#spy-three"]')).toHaveClass(/active/);
});

test('dialog and both drawer placements close with Escape and restore focus', async ({ page }) => {
  for (const [button, id] of [['Show dialog', 'catalogue-dialog'], ['Show side drawer', 'catalogue-drawer'], ['Show bottom sheet', 'bottom-drawer']]) {
    const trigger = page.getByRole('button', { name: button, exact: true });
    await trigger.click();
    await expect(page.locator(`#${id}`)).toBeVisible();
    expect(await page.locator(`#${id}`).evaluate(element => element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Tab');
    // Native dialogs may send Tab to browser chrome (body becomes active),
    // but must not allow keyboard focus into the inert page behind the modal.
    expect(await page.locator(`#${id}`).evaluate(element => document.activeElement === document.body || element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator(`#${id}`)).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test('tooltip, popover, toast, and alert dismissal work', async ({ page }) => {
  await page.getByRole('button', { name: 'Hover or focus for tooltip' }).focus();
  await expect(page.locator('div.tooltip')).toBeVisible();
  await expect(page.locator('div.tooltip')).toContainText('tiny yellow sticky note');
  await page.keyboard.press('Escape');
  await expect(page.locator('div.tooltip')).not.toBeVisible();
  await page.getByRole('button', { name: 'Show popover', exact: true }).click();
  await expect(page.locator('.popover')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.popover')).not.toBeVisible();
  await page.getByRole('button', { name: 'Show a toast' }).click();
  await expect(page.locator('#catalogue-toast')).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.locator('#catalogue-toast')).not.toBeVisible();
  await page.getByRole('button', { name: 'Dismiss connection alert' }).click();
  await expect(page.locator('#dismissible-alert')).toHaveCount(0);
});

test('carousel slides and indicators follow navigation', async ({ page }) => {
  await page.getByRole('button', { name: 'Next slide' }).click();
  await expect(page.locator('#web-carousel .carousel-item').nth(1)).toHaveClass(/active/);
  await page.getByRole('button', { name: 'Slide 3', exact: true }).click();
  await expect(page.locator('#web-carousel .carousel-item').nth(2)).toHaveClass(/active/);
  await page.getByRole('button', { name: 'Previous slide' }).click();
  await expect(page.locator('#web-carousel .carousel-item').nth(1)).toHaveClass(/active/);
});

test('offline catalogue bundles the calendar and all plugins locally', async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.goto(`file://${resolve('.build-offline/site/gallery.html')}`);
  await expect(page.locator('html')).toHaveAttribute('data-catalogue-ready', 'true');
  await expect(page.locator('body')).toHaveCSS('font-family', /Comic Sans/);
  await expect(page.locator('.catalog-grid').first()).toHaveCSS('display', 'grid');
  await expect(page.locator('#utility-hidden')).toHaveCSS('display', 'none');
  await expect(page.locator('#code-control .otp-slot').first()).toHaveCSS('display', 'flex');
  await page.locator('#browser-picker').click();
  await page.getByRole('textbox', { name: 'Search browsers' }).fill('firefox');
  await page.locator('#sample-combobox .menu-item').filter({ hasText: 'Firefox' }).click();
  await expect(page.locator('#browser-picker')).toContainText('Firefox');
  await expect(page.locator('#inline-calendar[data-vc="calendar"]')).toBeVisible();
  expect(failures).toEqual([]);
});
