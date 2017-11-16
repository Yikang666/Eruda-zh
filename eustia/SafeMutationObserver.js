/* Safe MutationObserver, does nothing if MutationObserver is not supported.
 * 
 * ```javascript
 * var observer = new DomObserver(function (mutations) 
 * {
 *     // Do something.     
 * });
 * observer.observe(document.htmlElement);
 * observer.disconnect();
 * ```
 */

exports = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

if (!exports) 
{
    exports = class MutationObserver {
        constructor() {}
        observe() {}
        disconnect() {}
        takeRecords() {}
    };
}
