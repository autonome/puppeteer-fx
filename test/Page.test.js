import { prepare } from './utility';


var server, browser, page;


describe('Browser',  () => {

    before(async () => {

        ({server, browser} = await prepare());

        page = await browser.newPage();
    });

    /**
     * @test {Page#goto}
     */
    it('Load a page',  async () => {

        await page.goto( server );
    });
});
