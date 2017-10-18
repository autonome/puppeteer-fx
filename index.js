const foxdriver = require('foxdriver');
const defaultLaunchURL = 'about:blank';

class puppeteer {
  constructor(opts) {
  }
	async launch() {
    const { browser: fdBrowser, tab: fdTab } = await foxdriver.launch({url: defaultLaunchURL});
    return new browser({fdBrowser, fdTab});
	}
}

class browser {
  constructor(opts) {
    this._fdBrowser = opts.fdBrowser;
    this._fdTab = opts.fdTab;
  }
	newPage() {
    return new page({fdTab: this._fdTab}); 
  }
  close() {
    return this._fdBrowser.close();
  }
}

class page {
  constructor(opts) {
    this._fdTab = opts.fdTab;
  }
  goto(url) {
    return this._fdTab.navigateTo(url);
  }
  async evaluate(arg) {
    var grip = await this._fdTab.console.evaluateJS(arg);
    return inflateGrip(grip);
  }
}

function inflateGrip(grip) {
  //console.log('grip', grip);
  let inflated;
  switch (grip.type) {
    case 'undefined':
      break;
    case 'object': 
    inflated = {};
    Object.keys(grip.preview.ownProperties).forEach(key => {
      inflated[key] = grip.preview.ownProperties[key].value;
    });
      break;
  }
  return inflated;
}

module.exports = new puppeteer();
