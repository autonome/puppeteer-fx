'use strict';

const EventEmitter = require('events'), Page = require('./Page');


/**
 * A Browser is created when Puppeteer connects to a Firefox instance
 *
 * @class
 * @extends EventEmitter
 */
class Browser extends EventEmitter {

    constructor({browser, tab}) {

        super()._page = [ ];

        this._browser = browser;

        this._tab = tab;
    }

    /**
     * @return {Promise<Page>}
     */
    newPage() {

        return  this._page[this._page.push(new Page({tab:  this._tab})) - 1];
    }

    /**
     * Closes Firefox and all of its pages (if any were opened).
     *
     * The Browser object itself is considered to be disposed and cannot be used anymore.
     *
     * @return {Promise}
     */
    close() {

        return  this._browser.close();
    }

    /**
     * @return {Promise<string>} Promise which resolves to the browser's original user agent
     */
    userAgent() {

        return  this._page[0].evaluate('navigator.userAgent');
    }
}

module.exports = Browser;
