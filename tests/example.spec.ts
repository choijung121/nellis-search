import { test, expect } from '@playwright/test';
import { NellisPage } from '../pageobject/NellisPage';

test('search for items', async ({ page }) => {
  const nellisPage = new NellisPage(page);
  await nellisPage.goto();

  // Expect a title "to contain" a substring.
  await expect(nellisPage.pageTitle).toBeVisible();
  await nellisPage.searchForItem('laptop');
});
