const foxdriver = require('foxdriver');
const defaultLaunchURL = 'about:blank';

class puppeteer {
  constructor() {
  }
	async launch(opts) {
    var launchCfg = {
      url: defaultLaunchURL,
      bin: opts.executablePath || '',
      args: []
    };

    if (opts.headless) {
      launchCfg.args.push('--headless');
    }

    if (opts.userDataDir) {
      launchCfg.args.push('--profile');
      launchCfg.args.push(opts.userDataDir);
    }

    const { browser: fdBrowser, tab: fdTab } = await foxdriver.launch(launchCfg);
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

/*

http://searchfox.org/mozilla-central/source/devtools/shared/client/object-client.js

https://github.com/devtools-html/devtools-core/tree/master/packages/devtools-reps/src/reps

*/
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
