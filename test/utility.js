import Puppeteer from '../source';

import WebServer from 'koapache';


export  async function getEnv() {

    var host = await (new WebServer('docs/')).workerHost();

    host = `http://${host.address}:${host.port}/`;

    return {
        host,
        page:  await (await Puppeteer.launch({
            headless:  !process.env.npm_lifecycle_script.includes('--inspect')
        })).newPage()
    };
}
