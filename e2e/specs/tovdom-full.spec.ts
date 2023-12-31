import { test, expect } from '../tests';

test.describe('toVdom - full', () => {
	test.beforeEach(async ({ goToFile }) => {
		await goToFile('tovdom-full.html');
	});

	test('it should stop when it founds data-wp-ignore', async ({ page }) => {
		const el = page.getByTestId('inside data-wp-ignore');
		await expect(el).toBeVisible();
	});

	test('it should not change data-wp-ignore content after navigation', async ({
		page,
	}) => {
		// Next HTML purposely changes content inside `data-wp-ignore`.
		await page.getByTestId('next').click();

		const oldContent = page.getByTestId('inside data-wp-ignore');
		await expect(oldContent).toBeVisible();

		const newContent = page.getByTestId(
			'new content inside data-wp-ignore'
		);
		await expect(newContent).not.toBeVisible();

		const link = page.getByTestId('next');
		await expect(link).not.toBeVisible();
	});
});
