'use strict';

const foxdriver = require('foxdriver'), Browser = require('./Browser');


class Puppeteer {

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

module.exports = Puppeteer;
