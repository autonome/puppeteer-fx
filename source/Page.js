'use strict';

const EventEmitter = require('events');


/**
 * Page provides methods to interact with a single tab in Firefox.
 *
 * One Browser instance might have multiple Page instances.
 *
 * @class
 * @extends EventEmitter
 */
class Page extends EventEmitter {

    constructor({tab}) {

        super()._tab = tab;
    }

    /**
     * @private
     *
     * @see {@link http://searchfox.org/mozilla-central/source/devtools/shared/client/object-client.js}
     *
     * @see {@link https://github.com/devtools-html/devtools-core/tree/master/packages/devtools-reps/src/reps}
     */
    static inflateGrip(grip) {

        var inflated;

        switch ( grip.type ) {
            case 'undefined':
                break;
            case 'object': {

                inflated = { };

                for (let key  of  Object.keys( grip.preview.ownProperties ))
                    inflated[ key ] = grip.preview.ownProperties[ key ].value;

                break;
            }
        }

        return inflated;
    }

    /**
     * @param {string} [url='about:blank'] URL to navigate page to.
     *                                     The url should include scheme, e.g. https://.
     * @return {Promise}
     */
    goto(url) {

        return  this._tab.navigateTo( url );
    }

    /**
     * @param {function|string} expression - Function or Expression to be evaluated in the page context
     * @param {Serializable}    parameter  - Arguments to pass to the function
     *
     * @return {Promise<Serializable>} Promise which resolves to the value of `expression`
     */
    async evaluate(expression, ...parameter) {

        return Page.inflateGrip(
            await this._tab.console.evaluateJS(expression, ...parameter)
        );
    }
}

module.exports = Page;
