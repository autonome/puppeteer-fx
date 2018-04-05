'use strict';

const EventEmitter = require('events');


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

    goto(url) {

        return  this._tab.navigateTo( url );
    }

    async evaluate(arg) {

        return  Page.inflateGrip(await this._tab.console.evaluateJS( arg ));
    }
}

module.exports = Page;
