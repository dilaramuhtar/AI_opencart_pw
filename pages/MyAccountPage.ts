import type { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    // Locators
    private readonly accountHeading: Locator;
    private readonly logoutLink: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.accountHeading = page.getByRole('heading', { name: 'My Account', exact: true, level: 2 });
        this.logoutLink = page.getByRole('complementary').getByRole('link', { name: 'Logout', exact: true });
    }

    /** Return the authenticated dashboard heading. */
    get heading(): Locator { return this.accountHeading; }

    /** Return authenticated account navigation. */
    get logout(): Locator { return this.logoutLink; }

    /** Return account editing navigation. */
    get editAccount(): Locator { return this.page.getByRole('link', { name: 'Edit your account information', exact: true }); }

    /** Log out through account navigation. */
    async clickLogout(): Promise<void> { await this.logoutLink.click(); }

}
