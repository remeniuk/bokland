/* global define */
define(function(require) {
    'use strict';

    // code
    return {
        get: function(name) {
            var regexp = new RegExp('(?:^|;\\s*)' + name + '\\s*=\\s*([^;]*)', 'g'),
                res = regexp.exec(document.cookie);

            return (res) ? decodeURIComponent(res[1]) : null;
        }
    };
});