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

        dimensionLabel: function (fieldName) {
            var _this = this;

            var dimension = _.find(_this.get("dimensions"), function (dim) {
                return dim.id == fieldName;
            });

            return dimension.name;
        },

        dimensionValueLabel: function (fieldName, key) {
            var _this = this;

            var dimension = _.find(_this.get("dimensions"), function (dim) {
                return dim.id == fieldName;
            });

            if(dimension.dictionary && dimension.dictionary[key]){
                return dimension.dictionary[key];
            } else {
                if(dimension.type == 'date'){
                    return d3.time.format("%x")(new Date(key));
                } else {
                    return key;
                }
            }
        }
    });

    return Model;
});