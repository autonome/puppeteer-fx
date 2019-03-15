# Puppeteer for Firefox

Headless Firefox NodeJS API based on [FoxDriver](https://github.com/saucelabs/foxdriver/) (written by the wonderful folks at [Sauce Labs](https://saucelabs.com/)), which is compatible with [Puppeteer API](https://github.com/GoogleChrome/puppeteer/).

[![NPM Dependency](https://david-dm.org/autonome/puppeteer-fx.svg)](https://david-dm.org/autonome/puppeteer-fx)
[![Build Status](https://travis-ci.com/autonome/puppeteer-fx.svg?branch=master)](https://travis-ci.com/autonome/puppeteer-fx)

[![NPM](https://nodei.co/npm/puppeteer-fx.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/puppeteer-fx/)



## Supported APIs

Execute `npm start` for details.



## Extra  APIs

Network Throttling

* Firefox-only
* Add "throttling" option to launch()
* Supported properties
  * downloadThroughput: integer, bytes/s, defaults to 75000
  * uploadThroughput: integer, bytes/s, defaults to 25000
  * latency: integer, in milliseconds, defaults to 100



## Installation

It's on NPM, so add `puppeteer-fx` to your dependencies in package.json, or:

```Shell
npm install puppeteer-fx
```


## Example

```JavaScript
const puppeteer = require('./puppeteer-fx');

(async () => {

    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();

    await page.goto('https://mozilla.github.io/arewefastyet-speedometer/2.0/');

    await page.evaluate(
        'document.querySelector("section#home div.buttons button").click()'
    );
})();
```


## Profiles

 - Base: https://github.com/saucelabs/foxdriver/blob/master/lib/config/profile/prefs.js

 - More: https://github.com/autonome/puppeteer-fx/blob/master/source/install/user_prefs.json



## Similar works

 - [Puppeteer-IE](https://tech-query.me/Puppeteer-IE/)
