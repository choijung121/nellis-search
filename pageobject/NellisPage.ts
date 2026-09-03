import { Page, Locator } from '@playwright/test';

export class NellisPage {
    pageTitle: Locator;
    searchInput: Locator;
    searchButton: Locator;
    itemTitle: Locator;

    constructor(private readonly page: Page) {
        this.page = page;
        this.pageTitle = page.getByRole('heading', { name: 'Shop and Save at Nellis' });
        this.searchInput = page.getByRole('searchbox', { name: 'Search items' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.itemTitle = page.getByRole('heading', { level: 6 });
    }

    async goto() {
        await this.page.goto('https://www.nellisauction.com/');
    }

    async searchForItem(item: string) {
        await this.searchInput.fill(item);
        await this.searchButton.click();
    }

    async gatherItemTitles(): Promise<string[]> {
        const titles = await this.itemTitle.allTextContents();
        return titles;
    }
}