import type { Page, Locator } from '@playwright/test';

export class SearchPage {
    // Locators
    private readonly resultsHeading: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.resultsHeading = page.getByRole('heading', { level: 1 });
    }

    /** Return the search page heading. */
    get heading(): Locator { return this.resultsHeading; }

    /** Return a product title, excluding its duplicate image link. @param name - Product name. */
    product(name: string): Locator { return this.page.getByRole('heading', { name, exact: true, level: 4 }).getByRole('link'); }

    /** Open the selected product. @param name - Product name. */
    async openProduct(name: string): Promise<void> { await this.product(name).click(); }

}
