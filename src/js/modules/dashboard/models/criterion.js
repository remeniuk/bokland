/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: function () {
            return config.server + (config.stubs ? this.json :
                'meta/filters/' + this.json);
        },

        fetch: function (options) {
            var _this = this,
                _mapping;

            if (config.stubs) {
                _mapping = {
                    'p': 'filter-criterion-category.json',
                    'rd': 'filter-criterion-date.json',
                    'd': 'filter-criterion-date.json',
                    'em': 'filter-criterion-range.json'
                };
            } else {
                _mapping = {
                    'p': 'category',
                    'rd': 'date',
                    'd': 'date',
                    'em': 'range'
                };
            }

            _this.json = _mapping[_this.id];

            return BaseModel.prototype.fetch.call(_this, options);
        }
    });

    return Model;
});