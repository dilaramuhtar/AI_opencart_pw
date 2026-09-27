import { resolve } from 'node:path';
import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

type LoginRow = {
    testName?: string;
    TestName?: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
};

const rows: LoginRow[] = DataProvider.readJson(resolve(__dirname, '../../testdata/opencart_logindata.json'));

// Per user clarification, use WEB_APP_URL for these rows as well as the other web scenarios.
for (const [index, row] of rows.entries()) {
    test(`Login row ${index + 1}: ${row.testName ?? row.TestName} @master @regression @datadriven @web`, async ({ homePage, loginPage, myAccountPage, page }) => {
        await test.step('1) Open the configured store login page', async () => {
            await homePage.openAccountMenu('Login');
            await expect(loginPage.heading).toBeVisible();
        });
        await test.step('2) Submit the external data, leaving whitespace-only fields empty', async () => {
            await loginPage.login(row.email, row.password);
        });
        await test.step('3) Verify the expected authentication result', async () => {
            expect(['success', 'failure']).toContain(row.expected);
            if (row.expected === 'success') {
                await expect(page).toHaveURL(/route=account\/account/);
                await expect(myAccountPage.heading).toBeVisible();
                await expect(myAccountPage.logout).toBeVisible();
            } else {
                // Blank fields submit; repeated attempts on the shared store may return its lockout warning.
                await expect(loginPage.rejection).toBeVisible();
                await expect(loginPage.heading).toBeVisible();
                await expect(page).toHaveURL(/route=account\/login/);
                await expect(myAccountPage.logout).toHaveCount(0);
            }
        });
        console.log(`✅ Login data row ${index + 1} matched its expected result.`);
    });
}
