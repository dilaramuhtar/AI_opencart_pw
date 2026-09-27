import type { Page, Locator } from '@playwright/test';

export class CartPage {
    // Locators
    private readonly cartHeading: Locator;
    private readonly rows: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.cartHeading = page.getByRole('heading', { name: /^Shopping Cart/ });
        this.rows = page.getByRole('row');
    }

    /** Return the cart page heading. */
    get heading(): Locator { return this.cartHeading; }

    /** Locate the unique cart row. @param name - Product name. */
    productRow(name: string): Locator { return this.rows.filter({ has: this.page.getByRole('link', { name, exact: true }) }); }

    /** Return the cart quantity field. @param name - Product name. */
    quantity(name: string): Locator { return this.productRow(name).getByRole('textbox'); }

    /** Return the unit price cell (verified fifth column). @param name - Product name. */
    unitPrice(name: string): Locator { return this.productRow(name).getByRole('cell').nth(4); }

    /** Return the line total cell (verified sixth column). @param name - Product name. */
    lineTotal(name: string): Locator { return this.productRow(name).getByRole('cell').nth(5); }

    /** Return the final total, excluding subtotal and tax rows. */
    get total(): Locator { return this.rows.filter({ has: this.page.getByRole('cell', { name: 'Total:', exact: true }) }).getByRole('cell').last(); }

}
