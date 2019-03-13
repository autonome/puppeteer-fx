import EventEmitter from 'events';

import { resolve } from 'path';


/**
 * Page provides methods to interact with a single tab in Firefox.
 *
 * One Browser instance might have multiple Page instances.
 */
export default  class Page extends EventEmitter {

    constructor({tab}) {

        super()._tab = tab;
    }

    /**
     * @private
     *
     * @see {@link http://searchfox.org/mozilla-central/source/devtools/shared/client/object-client.js}
     *
     * @see {@link https://github.com/devtools-html/devtools-core/tree/master/packages/devtools-reps/src/reps}
     *
     * @return {?object}
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
     * @return {Promise}
     */
    reload() {

        return  this._tab.reload();
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

    /**
     * @return {Promise<string>}
     */
    title() {

        return this.evaluate('document.title');
    }

    /**
     * @return {Promise}
     */
    goBack() {

        return  this.evaluate('history.back()');
    }

    /**
     * @return {Promise}
     */
    goFoward() {

        return  this.evaluate('history.forward()');
    }

    /**
     * Gets the full HTML contents of the page, including the doctype.
     *
     * @return {Promise<string>}
     */
    content() {

        return  this.evaluate(() => {

            const DocType = document.doctype;

            var type = `<!DocType ${(DocType.name + '').toUpperCase()}`;

            if ( DocType.publicId.valueOf() )
                type += ` Public "${DocType.publicId}"`;

            if ( DocType.systemId.valueOf() )
                type += ` "${DocType.systemId}"`;

            return `${type}>${document.documentElement.outerHTML}`;
        });
    }

    /**
     * @param {string} HTML - HTML markup to assign to the page
     *
     * @return {Promise}
     */
    setContent(HTML) {

        return  this.evaluate(HTML => {

            document.open();

            document.write( HTML );

            document.close();

        },  HTML);
    }

    /**
     * The method runs `document.querySelector()` within the page.
     *
     * If no element matches the selector, the return value resolve to `null`.
     *
     * @param {string} selector - A selector to query page for
     *
     * @return {Promise<?ElementHandle>}
     */
    $(selector) {

        return this.evaluate(
            `document.querySelector(${ JSON.stringify( selector ) })`
        );
    }

    /**
     * The method runs `document.querySelectorAll()` within the page.
     * If no elements match the selector, the return value resolve to `[ ]`.
     *
     * @param {string} selector - A selector to query page for
     *
     * @return {Promise<Array<ElementHandle>>}
     */
    $$(selector) {

        return this.evaluate(
            `document.querySelectorAll(${ JSON.stringify( selector ) })`
        );
    }

    /**
     * Adds a `<link rel="stylesheet">` tag into the page with the desired url or
     * a `<style type="text/css">` tag with the content
     *
     * @param {object} options
     * @param {string} [options.path]    Path to the CSS file to be injected into frame.
     *                                   If path is a relative path,
     *                                   then it is resolved relative to current working directory.
     * @param {string} [options.url]     URL of the <link> tag
     * @param {string} [options.content] Raw CSS content to be injected into frame
     *
     * @return {Promise} which resolves to the added tag when the stylesheet's onload fires
     *                   or when the CSS content was injected into frame
     */
    addStyleTag({path, url, content}) {

        if ( path )  url = resolve( path );

        return  url ?
            this.evaluate(url => {

                var CSS = document.createElement('link');

                CSS.rel = 'stylesheet',  CSS.href = url;

                return  document.head.appendChild( CSS ).sheet;

            },  url)  :
            this._tab.styleSheets.addStyleSheet( content );
    }

    /**
     * Adds a `<script>` tag into the page with the desired url or content
     *
     * @param {object} options
     * @param {string} [options.path]    Path to the JavaScript file to be injected into frame.
     *                                   If path is a relative path,
     *                                   then it is resolved relative to current working directory.
     * @param {string} [options.url]     URL of a script to be added
     * @param {string} [options.content] Raw JavaScript content to be injected into frame
     *
     * @return {Promise} which resolves to the added tag when the script's onload fires
     *                   or when the script content was injected into frame
     */
    addScriptTag({path, url, content}) {

        if ( path )  url = resolve( path );

        return  this.evaluate((url, content) => {

            var JS = document.createElement('script');

            JS[url ? 'src' : 'text'] = url || content;

            return  document.head.appendChild( JS );

        },  url,  content);
    }

    /**
     * This method fetches an element with selector and focuses it.
     *
     * If there's no element matching selector, the method throws an error.
     *
     * @param {string} selector - A selector of an element to focus.
     *                            If there are multiple elements satisfying the selector,
     *                            the first will be focused.
     * @return {Promise} Promise which resolves when the element matching selector is successfully focused.
     *                   The promise will be rejected if there is no element matching selector.
     */
    focus(selector) {

        return this.evaluate(
            `document.querySelector(${ JSON.stringify( selector ) }).focus()`
        );
    }
}
