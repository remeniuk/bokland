/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        Backbone   = require('backbone');

    // code
    var Model = Backbone.Model.extend({
        url: function () {
            return config.funnelServer + (config.stubs ?
                'funnelDictionaries.json' :
                'reports/funnelDictionaries');
        }
    });

    return Model;
});