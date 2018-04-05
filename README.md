# Puppeteer for Firefox

I needed to run some tests against both Chrome and Firefox. Because I am lazy, I only wanted to write the harness code once.

So I took [Foxdriver](https://github.com/saucelabs/foxdriver), written by the wonderful folks at [Sauce Labs](https://saucelabs.com/), and wrapped the [Puppeteer API](https://github.com/GoogleChrome/puppeteer/) around it.

Well, just a tiny bit of it... enough to:

* Launch Firefox
* Open a URL
* Evaluate JS in the console of the page

I'll probably add more as I hit more functionality that I need.

Happy to accept PRs if you find this useful and want to add more API coverage.

[![NPM](https://nodei.co/npm/puppeteer-fx.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/puppeteer-fx/)



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

user.js

```JavaScript
user_pref("devtools.chrome.enabled", true);
user_pref("devtools.debugger.prompt-connection", false);
user_pref("devtools.debugger.remote-enabled", true);
user_pref("toolkit.telemetry.reportingpolicy.firstRun", false);
user_pref("browser.sessionstore.enabled", false);
user_pref("browser.sessionstore.resume_from_crash", false);
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("app.update.auto", false);
user_pref("app.update.enabled", false);
user_pref("app.update.service.enabled", false);
user_pref("toolkit.telemetry.prompted", true);
user_pref("browser.rights.override", true);
user_pref("browser.startup.homepage_override.mstone", "ignore");
user_pref("browser.shell.checkDefaultBrowser", false);
```

https://github.com/saucelabs/foxdriver/blob/master/lib/config/profile/prefs.js



## Similar works

 - [Puppeteer-IE](https://techquery.github.io/Puppeteer-IE/)
