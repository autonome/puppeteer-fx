import EventEmitter from 'events';

import { resolve } from 'path';


const _tab_ = Symbol('Page tab'), page_browser = new WeakMap();


/**
 * Page provides methods to interact with a single tab in Firefox.
 *
 * One Browser instance might have multiple Page instances.
 */
export default  class Page extends EventEmitter {
    /**
     * @param {Browser} browser
     * @param {Tab}     tab
     */
    constructor(browser, tab) {

        page_browser.set(super(), browser);

        this[_tab_] = tab;
    }

    /**
     * @return {Browser}
     */
    browser() {  return page_browser.get( this );  }

    /**
     * @protected
     *
     * @see {@link http://searchfox.org/mozilla-central/source/devtools/shared/client/object-client.js}
     *
     * @see {@link https://github.com/devtools-html/devtools-core/tree/master/packages/devtools-reps/src/reps}
     *
     * @return {?object}
     */
    static inflateGrip(grip) {

        switch ( grip.type ) {
            case 'undefined':
                break;
            case 'object': {

                const { ownProperties } = grip.preview,  inflated = { };

                for (let key in ownProperties)
                    inflated[ key ] = ownProperties[ key ].value;

                return inflated;
            }
        }
    }

    /**
     * @param {function|string} expression - Function or Expression to be evaluated in the page context
     * @param {Serializable}    parameter  - Arguments to pass to the function
     *
     * @return {Promise<Serializable>} Promise which resolves to the value of `expression`
     */
    async evaluate(expression, ...parameter) {

        return Page.inflateGrip(
            await this[_tab_].console.evaluateJS(expression, ...parameter)
        );
    }

    async close() {  this.evaluate('self.close()');  }

    /**
     * @param {?Object} options
     *
     * @return {Promise}
     */
    waitForNavigation({waitUntil = 'load'} = { }) {

        return  this.evaluate(event => new Promise(resolve => {

            self.addEventListener(event, resolve);

        }), waitUntil);
    }

    /**
     * @param {String} [url='about:blank'] URL to navigate page to.
     *                                     The url should include scheme, e.g. https://.
     */
    async goto(url) {

        await this[_tab_].navigateTo( url );

        await this.waitForNavigation();
    }

    async reload() {

        await this[_tab_].reload();

        await this.waitForNavigation();
    }

    async goBack() {

        await this.evaluate('history.back()');

        await this.waitForNavigation();
    }

    async goFoward() {

        await this.evaluate('history.forward()');

        await this.waitForNavigation();
    }

    /**
     * @return {Promise<string>}
     */
    title() {  return this.evaluate(() => document.title);  }

    /**
     * Gets the full HTML contents of the page, including the doctype.
     *
     * @return {Promise<string>}
     */
    content() {

        return this.evaluate(
            ()  =>  ((new XMLSerializer()).serializeToString( document ))
        );
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
            selector => document.querySelector( selector ),  selector
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
            selector => document.querySelectorAll( selector ),  selector
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
            this[_tab_].styleSheets.addStyleSheet( content );
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
            selector => document.querySelector( selector ).focus(),  selector
        );
    }

    /**
     * @param {String} selector - A selector to search for element to click.
     *                            If there are multiple elements satisfying the selector,
     *                            the first will be clicked.
     * @return {Promise} Promise which resolves when the element matching selector is successfully clicked.
     *                   The Promise will be rejected if there is no element matching selector.
     */
    click(selector) {

        return this.evaluate(
            selector => document.querySelector( selector ).click(),  selector
        );
    }
}
