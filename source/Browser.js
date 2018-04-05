'use strict';

const EventEmitter = require('events'), Page = require('./Page');


class Browser extends EventEmitter {

    constructor({browser, tab}) {

        super();

        this._browser = browser;

        this._tab = tab;
    }

    newPage() {

        return  new Page({tab:  this._tab});
    }

    close() {

        return  this._browser.close();
    }
}

module.exports = Browser;
