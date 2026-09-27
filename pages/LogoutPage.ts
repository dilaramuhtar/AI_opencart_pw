import type { Page, Locator } from '@playwright/test';

export class LogoutPage {
    // Locators
    private readonly confirmationHeading: Locator;
    private readonly continueLink: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.confirmationHeading = page.getByRole('heading', { name: 'Account Logout', exact: true });
        this.continueLink = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /** Return the logout confirmation heading. */
    get heading(): Locator { return this.confirmationHeading; }

    /** Return the logout confirmation message. */
    get message(): Locator { return this.page.getByText('You have been logged off your account.', { exact: false }); }

    /** Return to the homepage. */
    async continueToHome(): Promise<void> { await this.continueLink.click(); }

}
