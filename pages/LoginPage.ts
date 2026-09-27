import type { Page, Locator } from '@playwright/test';

export class LoginPage {
    // Locators
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly submit: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.email = page.getByRole('textbox', { name: 'E-Mail Address', exact: true });
        this.password = page.getByRole('textbox', { name: 'Password', exact: true });
        this.submit = page.getByRole('button', { name: 'Login', exact: true });
    }

    /** Submit credentials, preserving blank fields. @param email - Login email. @param password - Login password. */
    async login(email: string, password: string): Promise<void> {
        try {
            await this.email.fill(email.trim() ? email : '');
            await this.password.fill(password.trim() ? password : '');
            await this.submit.click();
        } catch (error) {
            console.log('Login submission could not be completed.');
            throw error;
        }
    }

    /** Return the login form heading. */
    get heading(): Locator { return this.page.getByRole('heading', { name: 'Returning Customer', exact: true }); }

    /** Return the verified invalid/blank credential warning. */
    get warning(): Locator { return this.page.getByText('Warning: No match for E-Mail Address and/or Password.', { exact: true }); }

    /** Return an observed authentication rejection, including the shared store's lockout. */
    get rejection(): Locator {
        return this.warning.or(this.page.getByText('Warning: Your account has exceeded allowed number of login attempts. Please try again in 1 hour.', { exact: true }));
    }
}
