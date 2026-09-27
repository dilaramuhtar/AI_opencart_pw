# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web/opencart-shopping.spec.ts >> Complete customer shopping journey @master @regression @end-to-end @web
- Location: tests/web/opencart-shopping.spec.ts:40:5

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
  2  | import { Helper } from '../../utils/helper';
  3  | import { RandomDataUtil } from '../../utils/dataGenerator';
  4  | 
  5  | test('Product search @master @sanity @regression @web', async ({ homePage, searchPage, page }) => {
  6  |     const { productName } = Helper.getProductDetails();
  7  |     await test.step('1) Search for the configured product', async () => {
  8  |         await homePage.search(productName);
  9  |     });
  10 |     await test.step('2) Verify the results and exact product name', async () => {
  11 |         await expect(page).toHaveURL(/route=product\/search/);
  12 |         await expect(searchPage.heading).toHaveText(`Search - ${productName}`);
  13 |         await expect(searchPage.product(productName)).toBeVisible();
  14 |         await expect(searchPage.product(productName)).toHaveText(productName);
  15 |     });
  16 |     console.log('✅ Product search completed successfully.');
  17 | });
  18 | 
  19 | test('Add product to cart @master @sanity @regression @web', async ({ homePage, searchPage, productPage, cartPage }) => {
  20 |     const { productName, productQuantity } = Helper.getProductDetails();
  21 |     await test.step('1) Search and open product details', async () => {
  22 |         await homePage.search(productName);
  23 |         await expect(searchPage.product(productName)).toBeVisible();
  24 |         await searchPage.openProduct(productName);
  25 |         await expect(productPage.heading).toHaveText(productName);
  26 |     });
  27 |     await test.step('2) Add the requested quantity', async () => {
  28 |         await productPage.addToCart(productQuantity);
  29 |         await expect(productPage.confirmation).toContainText(`Success: You have added ${productName} to your shopping cart!`);
  30 |     });
  31 |     await test.step('3) Verify cart contents and quantity', async () => {
  32 |         await homePage.openCart();
  33 |         await expect(cartPage.heading).toBeVisible();
  34 |         await expect(cartPage.productRow(productName)).toHaveCount(1);
  35 |         await expect(cartPage.quantity(productName)).toHaveValue(productQuantity);
  36 |     });
  37 |     console.log('✅ Product added to the cart successfully.');
  38 | });
  39 | 
  40 | test('Complete customer shopping journey @master @regression @end-to-end @web', async ({ homePage, registrationPage, myAccountPage, logoutPage, loginPage, searchPage, productPage, cartPage, page }) => {
  41 |     const customer = RandomDataUtil.generateCustomerRegistrationPayload();
  42 |     const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
  43 |     let unitPrice: number;
  44 |     await test.step('1) Register a unique customer', async () => {
  45 |         await homePage.openAccountMenu('Register');
  46 |         await expect(registrationPage.heading).toBeVisible();
  47 |         await registrationPage.completeRegistration(customer);
  48 |         await expect(registrationPage.confirmation).toBeVisible();
  49 |         await registrationPage.continueToAccount();
> 50 |         await expect(myAccountPage.heading).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  51 |     });
  52 |     await test.step('2) Log out and log in using the new credentials', async () => {
  53 |         await myAccountPage.clickLogout();
  54 |         await expect(logoutPage.heading).toBeVisible();
  55 |         await logoutPage.continueToHome();
  56 |         await homePage.openAccountMenu('Login');
  57 |         await loginPage.login(customer.email, customer.password);
  58 |         await expect(page).toHaveURL(/route=account\/account/);
  59 |         await expect(myAccountPage.heading).toBeVisible();
  60 |         await expect(myAccountPage.logout).toBeVisible();
  61 |     });
  62 |     await test.step('3) Search and add the product', async () => {
  63 |         await homePage.search(productName);
  64 |         await expect(searchPage.product(productName)).toHaveText(productName);
  65 |         await searchPage.openProduct(productName);
  66 |         await expect(productPage.heading).toHaveText(productName);
  67 |         await expect(productPage.price).toBeVisible();
  68 |         unitPrice = Helper.convertPriceToNumber(await productPage.price.innerText());
  69 |         expect(unitPrice).toBeGreaterThan(0);
  70 |         await productPage.addToCart(productQuantity);
  71 |         await expect(productPage.confirmation).toContainText(`Success: You have added ${productName} to your shopping cart!`);
  72 |     });
  73 |     await test.step('4) Verify product, quantity, price and applicable total', async () => {
  74 |         await homePage.openCart();
  75 |         await expect(cartPage.heading).toBeVisible();
  76 |         await expect(cartPage.productRow(productName)).toHaveCount(1);
  77 |         await expect(cartPage.quantity(productName)).toHaveValue(productQuantity);
  78 |         expect(Helper.convertPriceToNumber(await cartPage.unitPrice(productName).innerText())).toBe(unitPrice);
  79 |         expect(Helper.convertPriceToNumber(await cartPage.lineTotal(productName).innerText())).toBeCloseTo(unitPrice * Number(productQuantity), 2);
  80 |         await expect(cartPage.total).toHaveText(totalPrice);
  81 |         expect(Helper.convertPriceToNumber(await cartPage.total.innerText())).toBeCloseTo(unitPrice * Number(productQuantity), 2);
  82 |     });
  83 |     console.log('✅ Complete customer shopping journey succeeded.');
  84 | });
  85 | 
```