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

        super();

        this._browser = browser;

        this._tab = tab;
    }

    /**
     * @return {Promise<Page>}
     */
    newPage() {

        return  new Page({tab:  this._tab});
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
}

module.exports = Browser;
