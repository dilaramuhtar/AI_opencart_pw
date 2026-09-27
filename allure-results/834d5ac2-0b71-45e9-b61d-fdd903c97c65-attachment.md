# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web/opencart-account.spec.ts >> Customer registration @master @sanity @regression @web
- Location: tests/web/opencart-account.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'My Account', exact: true })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'My Account', exact: true }) resolved to 2 elements:
    1) <h2>My Account</h2> aka locator('#content').getByRole('heading', { name: 'My Account' })
    2) <h5>My Account</h5> aka getByRole('contentinfo').getByRole('heading', { name: 'My Account' })

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'My Account', exact: true }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'My Account', exact: true })

```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures/pageFixtures';
  2  | import { RandomDataUtil } from '../../utils/dataGenerator';
  3  | import { Helper } from '../../utils/helper';
  4  | 
  5  | test('Customer registration @master @sanity @regression @web', async ({ homePage, registrationPage, myAccountPage, page }) => {
  6  |     const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  7  |     await test.step('1) Open registration', async () => {
  8  |         await homePage.openAccountMenu('Register');
  9  |         await expect(registrationPage.heading).toBeVisible();
  10 |     });
  11 |     await test.step('2) Register a unique customer and verify confirmation', async () => {
  12 |         await registrationPage.completeRegistration(customer);
  13 |         await expect(registrationPage.confirmation).toBeVisible();
  14 |         await expect(page).toHaveURL(/route=account\/success/);
  15 |     });
  16 |     await test.step('3) Verify access to the new account', async () => {
  17 |         await registrationPage.continueToAccount();
> 18 |         await expect(myAccountPage.heading).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  19 |         await expect(myAccountPage.editAccount).toBeVisible();
  20 |         await expect(myAccountPage.logout).toBeVisible();
  21 |     });
  22 |     console.log('✅ Customer registration completed successfully.');
  23 | });
  24 | 
  25 | test('Valid customer login @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
  26 |     const { email, password } = Helper.getLoginDetails();
  27 |     await test.step('1) Open the login form', async () => {
  28 |         await homePage.openAccountMenu('Login');
  29 |         await expect(loginPage.heading).toBeVisible();
  30 |     });
  31 |     await test.step('2) Authenticate with configured credentials', async () => {
  32 |         expect(email, 'APP_EMAIL must be configured').not.toBe('');
  33 |         expect(password, 'APP_PASSWORD must be configured').not.toBe('');
  34 |         await loginPage.login(email, password);
  35 |         await expect(page).toHaveURL(/route=account\/account/);
  36 |         await expect(myAccountPage.heading).toBeVisible();
  37 |         await expect(myAccountPage.editAccount).toBeVisible();
  38 |         await expect(myAccountPage.logout).toBeVisible();
  39 |     });
  40 |     console.log('✅ Valid login completed successfully.');
  41 | });
  42 | 
  43 | test('Invalid customer login @master @regression @web', async ({ homePage, loginPage, myAccountPage, page }) => {
  44 |     const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  45 |     await test.step('1) Open login', async () => {
  46 |         await homePage.openAccountMenu('Login');
  47 |         await expect(loginPage.heading).toBeVisible();
  48 |     });
  49 |     await test.step('2) Reject unregistered credentials', async () => {
  50 |         await loginPage.login(customer.email, customer.password);
  51 |         await expect(loginPage.warning).toBeVisible();
  52 |         await expect(loginPage.heading).toBeVisible();
  53 |         await expect(page).toHaveURL(/route=account\/login/);
  54 |         await expect(myAccountPage.logout).toHaveCount(0);
  55 |     });
  56 |     console.log('✅ Invalid login was rejected.');
  57 | });
  58 | 
  59 | test('Customer logout @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage, logoutPage, page }) => {
  60 |     const { email, password } = Helper.getLoginDetails();
  61 |     await test.step('1) Authenticate with configured credentials', async () => {
  62 |         await homePage.openAccountMenu('Login');
  63 |         await loginPage.login(email, password);
  64 |         await expect(myAccountPage.heading).toBeVisible();
  65 |         await expect(myAccountPage.logout).toBeVisible();
  66 |     });
  67 |     await test.step('2) Log out and verify confirmation', async () => {
  68 |         await myAccountPage.clickLogout();
  69 |         await expect(logoutPage.heading).toBeVisible();
  70 |         await expect(logoutPage.message).toBeVisible();
  71 |     });
  72 |     await test.step('3) Return home and verify unauthenticated navigation', async () => {
  73 |         await logoutPage.continueToHome();
  74 |         await expect(page).toHaveURL(/route=common\/home/);
  75 |         await expect(homePage.heading).toBeVisible();
  76 |         await homePage.expandAccountMenu();
  77 |         await expect(homePage.accountOption('Login')).toBeVisible();
  78 |         await expect(homePage.accountOption('Register')).toBeVisible();
  79 |         await expect(homePage.accountOption('Logout')).toHaveCount(0);
  80 |     });
  81 |     console.log('✅ Logout completed successfully.');
  82 | });
  83 | 
```