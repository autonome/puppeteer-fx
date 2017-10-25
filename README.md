# Puppeteer for Firefox

I needed to run some tests against both Chrome and Firefox. Because I am lazy, I only wanted to write the harness code once.

So I took [Foxdriver](https://github.com/saucelabs/foxdriver), written by the wonderful folks at [Sauce Labs](https://saucelabs.com/), and wrapped the [Puppeteer API](https://github.com/GoogleChrome/puppeteer/) around it.

Well, just a tiny bit of it... enough to:

* Launch Firefox
* Open a URL
* Evaluate JS in the console of the page

I'll probably add more as I hit more functionality that I need.

Happy to accept PRs if you find this useful and want to add more API coverage.

## Supported APIs

* puppeteer
  * launch()
    * headless
    * userDataDir
* browser
  * newPage()
  * close()
* page
  * goto()
  * evaluate()

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

```bash

npm install puppeteer-fx
```

## Example

```
const puppeteerFx = require('./puppeteer-fx');
const url = 'https://mozilla.github.io/arewefastyet-speedometer/2.0/';
const browser = await puppeteer.launch({headless: false});

const page = await browser.newPage();
await page.goto(url);

page.evaluate('document.querySelector(\'section#home div.buttons button\').click()');
```

## Profiles


devtools.chrome.enabled: true
devtools.debugger.prompt-connection: false
devtools.debugger.remote-enabled: true
toolkit.telemetry.reportingpolicy.firstRun: false

https://github.com/saucelabs/foxdriver/blob/master/lib/config/profile/prefs.js

