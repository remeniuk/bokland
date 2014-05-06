/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        d3        = require('d3'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: config.server + 'cube-meta.json',

        measure: function (fieldName) {
            var _this = this;

            var measures = _.flatten(_.map(_this.get('measures'), function (category) {
                return category.items;
            }));

            return _.find(measures, function (measure) {
                return measure.id === fieldName;
            });
        },

        dimension: function (fieldName) {
            var _this = this;

            return _.find(_this.get('dimensions'), function (dim) {
                return dim.id === fieldName;
            });
        },

        dimensionLabel: function (fieldName) {
            return this.dimension(fieldName).name;
        },

        dimensionValueLabel: function (fieldName, key) {
            var _this = this;

            var dimension = _this.dimension(fieldName);

            if(dimension.dictionary && dimension.dictionary[key]){
                return dimension.dictionary[key];
            } else {
                if(dimension.type === 'date'){
                    return d3.time.format('%x')(new Date(key));
                } else {
                    return key;
                }
            }
        }
    });

    return Model;
});