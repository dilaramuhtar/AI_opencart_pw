import type { Page, Locator } from '@playwright/test';

export class RegistrationPage {
    // Locators
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly telephone: Locator;
    private readonly password: Locator;
    private readonly confirmPassword: Locator;
    private readonly privacy: Locator;
    private readonly submit: Locator;

    constructor(private readonly page: Page) {
        // Initialize locators with verified roles, labels and CSS selectors.
        this.firstName = page.getByPlaceholder('First Name', { exact: true });
        this.lastName = page.getByPlaceholder('Last Name', { exact: true });
        this.email = page.getByPlaceholder('E-Mail', { exact: true });
        this.telephone = page.getByPlaceholder('Telephone', { exact: true });
        this.password = page.getByPlaceholder('Password', { exact: true });
        this.confirmPassword = page.getByPlaceholder('Password Confirm', { exact: true });
        this.privacy = page.getByRole('checkbox');
        this.submit = page.getByRole('button', { name: 'Continue', exact: true });
    }

    /** Fill and submit registration. @param customer - Generated customer details. */
    async completeRegistration(customer: { firstName: string; lastName: string; email: string; telephone: string; password: string }): Promise<void> {
        try {
            await this.firstName.fill(customer.firstName);
            await this.lastName.fill(customer.lastName);
            await this.email.fill(customer.email);
            await this.telephone.fill(customer.telephone);
            await this.password.fill(customer.password);
            await this.confirmPassword.fill(customer.password);
            await this.privacy.check();
            await this.submit.click();
        } catch (error) {
            console.log('Registration could not be completed.');
            throw error;
        }
    }

    /** Return the registration heading. */
    get heading(): Locator { return this.page.getByRole('heading', { name: 'Register Account', exact: true }); }

    /** Return the account-created confirmation. */
    get confirmation(): Locator { return this.page.getByRole('heading', { name: 'Your Account Has Been Created!', exact: true }); }

    /** Continue to the newly created account. */
    async continueToAccount(): Promise<void> { await this.page.getByRole('link', { name: 'Continue', exact: true }).click(); }

}
