import { getEnv } from './utility';


var page, host;


describe('test',  () => {

    before(async () => ({page, host} = await getEnv()));
    /**
     * @test {Page#goto}
     */
    it('Load a page',  async () => {

        await page.goto( host );
    });
});
