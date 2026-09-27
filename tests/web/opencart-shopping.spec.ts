import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Product search @master @sanity @regression @web', async ({ homePage, searchPage, page }) => {
    const { productName } = Helper.getProductDetails();
    await test.step('1) Search for the configured product', async () => {
        await homePage.search(productName);
    });
    await test.step('2) Verify the results and exact product name', async () => {
        await expect(page).toHaveURL(/route=product\/search/);
        await expect(searchPage.heading).toHaveText(`Search - ${productName}`);
        await expect(searchPage.product(productName)).toBeVisible();
        await expect(searchPage.product(productName)).toHaveText(productName);
    });
    console.log('✅ Product search completed successfully.');
});

test('Add product to cart @master @sanity @regression @web', async ({ homePage, searchPage, productPage, cartPage }) => {
    const { productName, productQuantity } = Helper.getProductDetails();
    await test.step('1) Search and open product details', async () => {
        await homePage.search(productName);
        await expect(searchPage.product(productName)).toBeVisible();
        await searchPage.openProduct(productName);
        await expect(productPage.heading).toHaveText(productName);
    });
    await test.step('2) Add the requested quantity', async () => {
        await productPage.addToCart(productQuantity);
        await expect(productPage.confirmation).toContainText(`Success: You have added ${productName} to your shopping cart!`);
    });
    await test.step('3) Verify cart contents and quantity', async () => {
        await homePage.openCart();
        await expect(cartPage.heading).toBeVisible();
        await expect(cartPage.productRow(productName)).toHaveCount(1);
        await expect(cartPage.quantity(productName)).toHaveValue(productQuantity);
    });
    console.log('✅ Product added to the cart successfully.');
});

test('Complete customer shopping journey @master @regression @end-to-end @web', async ({ homePage, registrationPage, myAccountPage, logoutPage, loginPage, searchPage, productPage, cartPage, page }) => {
    const customer = RandomDataUtil.generateCustomerRegistrationPayload();
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
    let unitPrice: number;
    await test.step('1) Register a unique customer', async () => {
        await homePage.openAccountMenu('Register');
        await expect(registrationPage.heading).toBeVisible();
        await registrationPage.completeRegistration(customer);
        await expect(registrationPage.confirmation).toBeVisible();
        await registrationPage.continueToAccount();
        await expect(myAccountPage.heading).toBeVisible();
    });
    await test.step('2) Log out and log in using the new credentials', async () => {
        await myAccountPage.clickLogout();
        await expect(logoutPage.heading).toBeVisible();
        await logoutPage.continueToHome();
        await homePage.openAccountMenu('Login');
        await loginPage.login(customer.email, customer.password);
        await expect(page).toHaveURL(/route=account\/account/);
        await expect(myAccountPage.heading).toBeVisible();
        await expect(myAccountPage.logout).toBeVisible();
    });
    await test.step('3) Search and add the product', async () => {
        await homePage.search(productName);
        await expect(searchPage.product(productName)).toHaveText(productName);
        await searchPage.openProduct(productName);
        await expect(productPage.heading).toHaveText(productName);
        await expect(productPage.price).toBeVisible();
        unitPrice = Helper.convertPriceToNumber(await productPage.price.innerText());
        expect(unitPrice).toBeGreaterThan(0);
        await productPage.addToCart(productQuantity);
        await expect(productPage.confirmation).toContainText(`Success: You have added ${productName} to your shopping cart!`);
    });
    await test.step('4) Verify product, quantity, price and applicable total', async () => {
        await homePage.openCart();
        await expect(cartPage.heading).toBeVisible();
        await expect(cartPage.productRow(productName)).toHaveCount(1);
        await expect(cartPage.quantity(productName)).toHaveValue(productQuantity);
        expect(Helper.convertPriceToNumber(await cartPage.unitPrice(productName).innerText())).toBe(unitPrice);
        expect(Helper.convertPriceToNumber(await cartPage.lineTotal(productName).innerText())).toBeCloseTo(unitPrice * Number(productQuantity), 2);
        await expect(cartPage.total).toHaveText(totalPrice);
        expect(Helper.convertPriceToNumber(await cartPage.total.innerText())).toBeCloseTo(unitPrice * Number(productQuantity), 2);
    });
    console.log('✅ Complete customer shopping journey succeeded.');
});
