import type { Page, Locator } from '@playwright/test';

export class ProductPage {
    // Locators
    private readonly productHeading: Locator;
    private readonly quantity: Locator;
    private readonly addButton: Locator;
    private readonly success: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.productHeading = page.getByRole('heading', { level: 1 });
        this.quantity = page.getByRole('textbox', { name: 'Qty', exact: true });
        this.addButton = page.getByRole('button', { name: 'Add to Cart', exact: true });
        this.success = page.getByText('Success: You have added', { exact: false });
    }

    /** Return the product name heading. */
    get heading(): Locator { return this.productHeading; }

    /** Return the displayed product price. */
    get price(): Locator { return this.page.getByRole('heading', { level: 2, name: /^\$/ }); }

    /** Return the add-to-cart confirmation. */
    get confirmation(): Locator { return this.success; }

    /** Add the requested quantity. @param quantity - Quantity to purchase. */
    async addToCart(quantity: string): Promise<void> {
        await this.quantity.fill(quantity);
        await this.addButton.click();
    }

}
