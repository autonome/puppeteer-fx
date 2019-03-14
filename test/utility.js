import Puppeteer from '../source';

import WebServer from 'koapache';


var env;

function bootBrowser() {

    return Puppeteer.launch({
        headless:  !process.env.npm_lifecycle_script.includes('--inspect')
    });
}

/**
 * @return   {Object}
 * @property {String}  server
 * @property {Browser} browser
 */
export  async function prepare() {

    if ( env ) {

        if (! (await env.browser.pages())[0])
            env.browser = await bootBrowser();

        return env;
    }

    var server = await (new WebServer('docs/')).workerHost();

    server = `http://${server.address}:${server.port}/`;

    return  env = {server,  browser: await bootBrowser()};
}
