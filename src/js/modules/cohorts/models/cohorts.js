/* global define */
define(function(require) {
    'use strict';

    // imports
    var _              = require('underscore'),
        config         = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var __super__ = BaseModel.prototype;
    var Model = BaseModel.extend({
        url: config.server + 'cohort-data.json',

        parse: function(response) {
            var _this = this;
            return response.data;
        }
    });

    return Model;
});