/* global define */
define(function(require) {
    'use strict';

    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */
    var transitionEnd = (function() {
        var el = document.createElement('div'),
            transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'transition'       : 'transitionend'
            };

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name];
            }
        }
    })();

    return {
        end: transitionEnd
    };
});