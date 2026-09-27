import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('Customer registration @master @sanity @regression @web', async ({ homePage, registrationPage, myAccountPage, page }) => {
    const customer = RandomDataUtil.generateCustomerRegistrationPayload();
    await test.step('1) Open registration', async () => {
        await homePage.openAccountMenu('Register');
        await expect(registrationPage.heading).toBeVisible();
    });
    await test.step('2) Register a unique customer and verify confirmation', async () => {
        await registrationPage.completeRegistration(customer);
        await expect(registrationPage.confirmation).toBeVisible();
        await expect(page).toHaveURL(/route=account\/success/);
    });
    await test.step('3) Verify access to the new account', async () => {
        await registrationPage.continueToAccount();
        await expect(myAccountPage.heading).toBeVisible();
        await expect(myAccountPage.editAccount).toBeVisible();
        await expect(myAccountPage.logout).toBeVisible();
    });
    console.log('✅ Customer registration completed successfully.');
});

test('Valid customer login @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
    const { email, password } = Helper.getLoginDetails();
    await test.step('1) Open the login form', async () => {
        await homePage.openAccountMenu('Login');
        await expect(loginPage.heading).toBeVisible();
    });
    await test.step('2) Authenticate with configured credentials', async () => {
        expect(email, 'APP_EMAIL must be configured').not.toBe('');
        expect(password, 'APP_PASSWORD must be configured').not.toBe('');
        await loginPage.login(email, password);
        await expect(page).toHaveURL(/route=account\/account/);
        await expect(myAccountPage.heading).toBeVisible();
        await expect(myAccountPage.editAccount).toBeVisible();
        await expect(myAccountPage.logout).toBeVisible();
    });
    console.log('✅ Valid login completed successfully.');
});

test('Invalid customer login @master @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
    const customer = RandomDataUtil.generateCustomerRegistrationPayload();
    await test.step('1) Open login', async () => {
        await homePage.openAccountMenu('Login');
        await expect(loginPage.heading).toBeVisible();
    });
    await test.step('2) Reject unregistered credentials', async () => {
        await loginPage.login(customer.email, customer.password);
        await expect(loginPage.warning).toBeVisible();
        await expect(loginPage.heading).toBeVisible();
        await expect(page).toHaveURL(/route=account\/login/);
        await expect(myAccountPage.logout).toHaveCount(0);
    });
    console.log('✅ Invalid login was rejected.');
});

test('Customer logout @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage, page }) => {
    const { email, password } = Helper.getLoginDetails();
    await test.step('1) Authenticate with configured credentials', async () => {
        await homePage.openAccountMenu('Login');
        await loginPage.login(email, password);
        await expect(myAccountPage.heading).toBeVisible();
        await expect(myAccountPage.logout).toBeVisible();
    });
    await test.step('2) Log out and verify confirmation', async () => {
        await myAccountPage.clickLogout();
        await expect(logoutPage.heading).toBeVisible();
        await expect(logoutPage.message).toBeVisible();
    });
    await test.step('3) Return home and verify unauthenticated navigation', async () => {
        await logoutPage.continueToHome();
        await expect(page).toHaveURL(/route=common\/home/);
        await expect(homePage.heading).toBeVisible();
        await homePage.expandAccountMenu();
        await expect(homePage.accountOption('Login')).toBeVisible();
        await expect(homePage.accountOption('Register')).toBeVisible();
        await expect(homePage.accountOption('Logout')).toHaveCount(0);
    });
    console.log('✅ Logout completed successfully.');
});
