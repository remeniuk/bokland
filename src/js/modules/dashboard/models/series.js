/* global define */
define(function(require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        config    = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: config.server + 'stats-series-single.json'
    });

    return Model;
});