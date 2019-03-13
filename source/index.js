import FoxDriver from 'foxdriver';

import { getNPMConfig } from '@tech_query/node-toolkit';

import Browser from './Browser';


const stack = [ ];


/**
 * Puppeteer API
 */
export default  class Puppeteer {
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
     * @return {Browser}
     */
    static async launch({
        executablePath = '',  headless = true,  userDataDir = '',  throttling = { }
    } = { }) {
        const launchCfg = {
            url:     'about:blank',
            bin:     executablePath || getNPMConfig('firefox'),
            args:    [ ]
        };

        if ( headless )  launchCfg.args.push('--headless');

        if ( userDataDir )  launchCfg.args.push('--profile', userDataDir);

        const remote = await FoxDriver.launch( launchCfg );

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


/**
 * Serializable value
 *
 * @typedef {number|boolean|string|object|array} Serializable
 *
 * @see     {@link
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description|Promise}
 */
