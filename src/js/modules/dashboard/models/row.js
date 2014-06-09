/* global define */
define(function(require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        defaults: {
            widgets: [],
            height: '200'
        }
    });

    return Model;
});