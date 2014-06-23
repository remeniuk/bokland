/* global define */
define(function(require) {
    'use strict';

    // imports
    var $               = require('jquery'),
        _               = require('underscore'),
        Backbone        = require('backbone'),
        FunnelRouter = require('./funnel');


    // code
    return {
        // routers
        funnel: new FunnelRouter(),

        // manage history functions
        navigate: function(fragment, options) {
            if (!_.isString(fragment)) {
                fragment = decodeURIComponent('~' + $.param(fragment).replace(/&/g, '~'));
            }

            return Backbone.history.navigate(fragment, options);
        },
        start: function() {
            return Backbone.history.start({pushState: false});
        }
    };
});