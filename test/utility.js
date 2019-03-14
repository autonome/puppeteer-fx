import Puppeteer from '../source';

import WebServer from 'koapache';


var env;


export  async function getEnv() {

    if ( env )  return env;

    var host = await (new WebServer('docs/')).workerHost();

    host = `http://${host.address}:${host.port}/`;

    return  env = {
        host,
        page:  await (await Puppeteer.launch({
            headless:  !process.env.npm_lifecycle_script.includes('--inspect')
        })).newPage()
    };
}
