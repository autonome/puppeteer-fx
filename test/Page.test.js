import { prepare } from './utility';


var server, browser, page;


describe('Page',  () => {

    before(async () => {

        ({server, browser} = await prepare());

        page = (await browser.pages())[1];
    });

    /**
     * @test {Page#waitForNavigation}
     */
    it('Load a page',  async () => {

        await page.goto( server );

        console.info(await page.title());
    });
});
