import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';

test('theme renders at wide and narrow sizes without missing assets or overflow', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Neo Geo for Bootstrap' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('body')).toHaveCSS('font-family', /Comic Sans/);
  await expect(page.getByRole('link', { name: 'Download the theme', exact: true })).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('link', { name: 'Full component catalogue', exact: true })).toHaveCSS('color', 'rgb(0, 0, 0)');
  await page.screenshot({ path: `evidence/${testInfo.project.name}/desktop.png`, fullPage: true });
  await page.screenshot({ path: `evidence/${testInfo.project.name}/desktop-first-screen.png` });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `evidence/${testInfo.project.name}/mobile.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('Bootstrap 6 tabs, menu, dialog and native accordion work', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Cool links' }).click();
  await expect(page.getByRole('heading', { name: 'My bookmarks collection' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Cool links' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Open the menu' }).click();
  await expect(page.locator('.menu').getByText('Get the theme')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu')).not.toBeVisible();
  await page.getByRole('button', { name: 'Open a dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({ path: `evidence/${testInfo.project.name}/dialog.png` });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open a dialog' })).toBeFocused();
  await page.getByText('Is this really Bootstrap 6?', { exact: true }).click();
  await expect(page.getByText('Yes! This demo runs Bootstrap')).toBeVisible();
});

test('guestbook validates, saves safely, and survives reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign the guestbook', exact: true }).click();
  await expect(page.getByLabel('Your screen name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toBeVisible();
  await page.getByLabel('Your screen name').fill('test_surfer');
  await page.getByLabel('Leave a little message').fill('<script>window.bad = true</script> Cool page!');
  await page.getByRole('button', { name: 'Sign the guestbook', exact: true }).click();
  await expect(page.locator('#guestbook-entries').getByText('test_surfer')).toBeVisible();
  await expect(page.locator('#guestbook-status')).toContainText('You’re in the guestbook!');
  await page.reload();
  await expect(page.locator('#guestbook-entries').getByText('test_surfer')).toBeVisible();
  expect(await page.evaluate(() => window.bad)).toBeUndefined();
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-geo-motion', 'off');
  await expect(page.locator('html')).toHaveCSS('--geo-stars', /radial-gradient/);
});

test('download contains a working offline demo', async ({ page }) => {
  await page.goto(`file://${resolve('.build-offline/site/index.html')}`);
  await expect(page.locator('body')).toHaveCSS('font-family', /Comic Sans/);
  await expect(page.locator('.showcase-grid').first()).toHaveCSS('display', 'grid');
  await page.getByRole('tab', { name: 'Cool links' }).click();
  await expect(page.getByRole('heading', { name: 'My bookmarks collection' })).toBeVisible();
  await page.getByRole('button', { name: 'Open a dialog' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
