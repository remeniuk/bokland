/* global define */
define(function(require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore');

    // import jquery plugins
    var deparam = require('deparam');


    // code
    return {
        param: function(params) {
            return decodeURIComponent('~' + $.param(params).replace(/&/g, '~'));
        },
        deparam: function(params) {
            var query = (params || '').replace(/~/g, '&'),
                json = $.deparam(query, true);

            if (_.isEmpty(json)) {
                json._ = null;
            }

            return json;
        }
    };
});