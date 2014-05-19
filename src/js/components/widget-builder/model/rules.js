/* global define */
define(function (require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        config    = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: function() {
            return config.server + (config.stubs ?
                 'widget-builder-rules.json' :
                'meta/rules');
        }
    });

    return Model;
});