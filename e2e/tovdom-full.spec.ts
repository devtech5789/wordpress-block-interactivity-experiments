import { join } from 'path';
import { test, expect } from '@playwright/test';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ page }) => {
		// Helpers to use URLs with http:// instead of file:// to avoid errors
		// inside `fetch` calls.
		await page.route('**/*.html', async (route, req) => {
			const { pathname } = new URL(req.url());
			route.fulfill({ path: join(__dirname, pathname) });
		});
		await page.route('**/*.js', async (route, req) => {
			const { pathname } = new URL(req.url());
			route.fulfill({ path: join(__dirname, '..', pathname) });
		});

		await page.goto('http://a.b/tovdom-full.html');
	});

	test('it should stop when it founds wp-ignore', async ({ page }) => {
		const el = page.getByTestId('inside wp-ignore');
		await expect(el).toBeVisible();
	});

	test('it should not change wp-ignore content after navigation', async ({
		page,
	}) => {
		// Next HTML purposely changes content inside `wp-ignore`.
		await page.getByTestId('next').click();

		const oldContent = page.getByTestId('inside wp-ignore');
		await expect(oldContent).toBeVisible();

		const newContent = page.getByTestId('new content inside wp-ignore');
		await expect(newContent).not.toBeVisible();

		const link = page.getByTestId('next');
		await expect(link).not.toBeVisible();
	});
});
