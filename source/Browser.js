import EventEmitter from 'events';

import FoxDriver from 'foxdriver';

import Page from './Page';


const _throttler_ = Symbol('Browser throttler'),
    _remote_ = Symbol('Browser remote'),
    tab_page = { };

/**
 * A Browser is created when Puppeteer connects to a Firefox instance
 */
export default  class Browser extends EventEmitter {
    /**
     * @param {?Object} launcher
     * @param {?Object} throttler
     */
    constructor(launcher, throttler) {

        super()[_throttler_] = throttler;

        this[_remote_] = FoxDriver.launch( launcher ).then(
            ({ browser })  =>  browser
        );
    }

    /**
     * @private
     *
     * @param {Tab} tab
     *
     * @return {Page}
     */
    async addPage(tab) {

        const page = new Page(this, tab);

        tab_page[tab.name] = page;

        const {downloadThroughput, uploadThroughput, latency} =
            this[_throttler_] || { };

        await tab.emulation.setNetworkThrottling(
            downloadThroughput, uploadThroughput, latency
        );

        return page;
    }

    /**
     * @return {Page[]}
     */
    async pages() {

        return  await Promise.all(
            (await (await this[_remote_]).listTabs())
                .map(tab  =>  tab_page[tab.name] || this.addPage( tab ))
        );
    }

    /**
     * @return {Page}
     */
    async newPage() {

        await  (await this.pages())[0].evaluate('self.open("about:blank")');

        return  (await this.pages()).slice(-1)[0];
    }

    /**
     * Closes Firefox and all of its pages (if any were opened).
     *
     * The Browser object itself is considered to be disposed and cannot be used anymore.
     */
    async close() {

        await Promise.all( (await this.pages()).map(page => page.close()) );
    }

    /**
     * @return {String} Promise which resolves to the browser's original user agent
     */
    async userAgent() {

        return  await (await this.pages())[0].evaluate('navigator.userAgent');
    }
}
