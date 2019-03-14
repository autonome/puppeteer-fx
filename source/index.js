import { getNPMConfig } from '@tech_query/node-toolkit';

import Browser from './Browser';


const stack = [ ];


/**
 * Puppeteer API
 */
export default  class Puppeteer {
    /**
     * @return {String} A path where Puppeteer expects to find installed Firefox
     */
    static executablePath() {  return getNPMConfig('firefox');  }

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
        executablePath = '',  headless = true,  userDataDir = '',  throttling
    } = { }) {
        const launchCfg = {
            url:     'about:blank',
            bin:     executablePath || this.executablePath(),
            args:    [ ]
        };

        if ( headless )  launchCfg.args.push('--headless');

        if ( userDataDir )  launchCfg.args.push('--profile', userDataDir);

        if ( throttling )
            throttling.downloadThroughput = throttling.downloadThroughput || 75000,
            throttling.uploadThroughput = throttling.uploadThroughput || 25000,
            throttling.latency = throttling.latency || 100;

        return  stack[stack.push(new Browser(launchCfg, throttling)) - 1];
    }

    /**
     * @param {?Error} error
     */
    static async exit(error) {

        await Promise.all( stack.map(browser => browser.close()) );

        if (!(error instanceof Error))  process.exit(0);

        console.error( error );

        process.exit(1);
    }
}


for (let event  of  ['uncaughtException', 'unhandledRejection', 'SIGINT', 'exit'])
    process.on(event, Puppeteer.exit);


/**
 * Serializable value
 *
 * @typedef {number|boolean|string|object|array} Serializable
 *
 * @see     {@link
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description|Promise}
 */
