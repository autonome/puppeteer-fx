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
* browser
  * newPage()
  * close()
* page
  * goto()
  * evaluate()


## Example

```
const puppeteerFx = require('./puppeteer-fx');
const url = 'https://mozilla.github.io/arewefastyet-speedometer/2.0/';
const browser = await puppeteer.launch({headless: false});

const page = await browser.newPage();
await page.goto(speedometerURL);

page.evaluate('document.querySelector(\'section#home div.buttons button\').click()');
```

