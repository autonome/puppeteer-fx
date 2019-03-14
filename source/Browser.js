import EventEmitter from 'events';

import FoxDriver from 'foxdriver';

import Page from './Page';


const _option_ = Symbol('Browser option'), page_browser = new Map();


/**
 * A Browser is created when Puppeteer connects to a Firefox instance
 */
export default  class Browser extends EventEmitter {
    /**
     * @param {?Object} launcher
     * @param {?Object} throttler
     */
    constructor(launcher, throttler) {

        super()[_option_] = {launcher, throttler};
    }

    /**
     * @return {Page}
     */
    async newPage() {

        var remote = await FoxDriver.launch( this[_option_].launcher ),
            {downloadThroughput, uploadThroughput, latency} =
                this[_option_].throttler || { };

        await remote.tab.emulation.setNetworkThrottling(
            downloadThroughput, uploadThroughput, latency
        );

        remote = new Page( remote );

        page_browser.set(remote, this);

        return remote;
    }

    /**
     * @return {Page[]}
     */
    async pages() {

        return Array.from(
            page_browser,  ([page, browser]) => (browser === this) && page
        ).filter( Boolean );
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
