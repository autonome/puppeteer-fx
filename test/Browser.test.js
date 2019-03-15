import { prepare } from './utility';


var browser;


describe('Browser',  () => {

    before(async () => ({ browser } = await prepare()));
    /**
     * @test {Browser#newPage}
     * @test {Browser#pages}
     */
    it('Create a page',  async () => {

        const page = await browser.newPage();

        page.browser().should.be.equal( browser );

        (await browser.pages())[1].should.be.equal( page );
    });
});
