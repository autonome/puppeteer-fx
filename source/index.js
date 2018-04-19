'use strict';

/**
 * Serializable value
 *
 * @typedef {number|boolean|string|object|array} Serializable
 *
 * @see     {@link
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description|Promise}
 */

/**
 * A proxy of the return value in the future
 *
 * @typedef {Promise} Promise
 *
 * @see     {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise|Promise}
 */

/**
 * Event emitter
 *
 * @typedef {EventEmitter} EventEmitter
 *
 * @see {@link https://nodejs.org/dist/latest-v6.x/docs/api/events.html#events_class_eventemitter|Node.JS - Event module}
 */

const foxdriver = require('foxdriver'), Browser = require('./Browser'), stack = [ ];


/**
 * Puppeteer API
 *
 * @class
 */
class Puppeteer {
    /**
     * Launch a browser instance with given arguments.
     * The browser will be closed when the parent NodeJS process is closed.
     *
     * @param {object}  [options]                       Set of configurable options to set on the browser
     * @param {string}  [options.executablePath = true] Path to a Firefox executable to run.
     *                                                  If `executablePath` is a relative path,
     *                                                  then it is resolved relative to current working directory.
     * @param {boolean} [options.headless = true]       Whether to run browser in headless mode
     * @param {string}  [options.userDataDir = '']      Path to a User Data Directory
     * @param {object}  [options.throttling]            Network Throttling
     *
     * @return {Promise<Browser>}
     */
    static async launch({
        executablePath = '',  headless = true,  userDataDir = '',  throttling = { }
    }) {
        const launchCfg = {
            url:     'about:blank',
            bin:     executablePath,
            args:    [ ]
        };

        if ( headless )  launchCfg.args.push('--headless');

        if ( userDataDir )  launchCfg.args.push('--profile', userDataDir);

        const remote = await foxdriver.launch( launchCfg );

        if ( throttling )
            await remote.tab.emulation.setNetworkThrottling(
                throttling.downloadThroughput || 75000,
                throttling.uploadThroughput || 25000,
                throttling.latency || 100
            );

        return  new Browser( remote );
    }
}

async function clear(error) {

    await Promise.all( stack.map(browser => browser.close()) );

    if (error instanceof Error) {

        console.error( error );

        process.exit(1);
    }

    process.exit(0);
}

for (let event  of  ['uncaughtException', 'unhandledRejection', 'SIGINT', 'exit'])
    process.on(event, clear);


module.exports = Puppeteer;
