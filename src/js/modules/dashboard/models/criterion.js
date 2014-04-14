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
            return config.server + this.json;
        },

        fetch: function (options) {
            var _this = this;

            var _mapping = {
                'p': 'filter-criterion-category.json',
                'rd': 'filter-criterion-date.json',
                'd': 'filter-criterion-date.json',
                'em': 'filter-criterion-range.json'
            };

            _this.json = _mapping[_this.id];

            return BaseModel.prototype.fetch.call(_this, options);
        }
    });

    return Model;
});