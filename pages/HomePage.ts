import type { Page, Locator } from '@playwright/test';

export class HomePage {
    // Locators
    private readonly accountMenu: Locator;
    private readonly searchInput: Locator;
    private readonly cartLink: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.accountMenu = page.getByRole('link', { name: 'My Account' }).first();
        this.searchInput = page.getByRole('textbox', { name: 'Search', exact: true });
        this.cartLink = page.getByRole('link', { name: 'Shopping Cart', exact: false }).first();
    }

    /** Open an account menu entry. @param name - Entry to select. */
    async openAccountMenu(name: 'Register' | 'Login' | 'Logout'): Promise<void> {
        await this.accountMenu.click();
        await this.page.getByRole('link', { name, exact: true }).filter({ visible: true }).first().click();
    }

    /** Search the catalog. @param productName - Known product name. */
    async search(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchInput.press('Enter');
    }

    /** Open the shopping cart. */
    async openCart(): Promise<void> { await this.cartLink.click(); }

    /** Expand the account menu to inspect authentication options. */
    async expandAccountMenu(): Promise<void> { await this.accountMenu.click(); }

    /** Return a menu option for a web-first assertion. @param name - Option text. */
    accountOption(name: 'Login' | 'Register' | 'Logout'): Locator {
        return this.page.getByRole('link', { name, exact: true }).filter({ visible: true });
    }

    /** Return the homepage heading for a web-first assertion. */
    get heading(): Locator { return this.page.getByRole('heading', { name: 'Featured', exact: true }); }

}
