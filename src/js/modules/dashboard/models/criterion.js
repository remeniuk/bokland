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
                'meta/filters/' + this.get('id'));
        },

        fetch: function (options) {
            var _this = this;

            if (config.stubs) {
                var _mapping = {
                    'p': 'filter-criterion-category.json',
                    'rd': 'filter-criterion-date.json',
                    'date': 'filter-criterion-date.json',
                    'em': 'filter-criterion-range.json'
                };

                _this.json = _mapping[_this.id];
            }

            return BaseModel.prototype.fetch.call(_this, options);
        }
    });

    return Model;
});