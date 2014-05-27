/* global define */
define(function (require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        config    = require('config/api'),
        d3        = require('d3'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: function() {
            return config.server + (config.stubs ?
                'cube-meta.json' :
                'meta/dimensions');
        },

        measure: function (field) {
            var _this = this;

            var measures = _.flatten(_.map(_this.get('measures'), function (category) {
                return category.items;
            }));

            return _.find(measures, function (measure) {
                return measure.id === field;
            });
        },

        dimension: function (field) {
            var _this = this;

            return _.find(_this.get('dimensions'), function (dim) {
                return dim.id === field;
            });
        },

        dimensionLabel: function (field) {
            return this.dimension(field).name;
        },

        dimensionValueLabel: function (field, key, agg) {
            var _this = this;

            var dimension = _this.dimension(field);

            if(dimension.dictionary && dimension.dictionary[key]){
                return dimension.dictionary[key];
            } else {
                switch(dimension.type){
                    case 'date':
                        var format = _this.aggFormat(agg);
                        return d3.time.format(format)(new Date(parseInt(key)));

                    case 'number':
                        if (dimension.format === '$') {
                            return '$' + d3.format(',.2f')(key);
                        } else {
                            return dimension.format ? d3.format(format)(key) : key;
                        }
                    default:
                        return dimension.format ? d3.format(format)(key) : key;
                }
            }
        },

        aggFormat: function(aggregation) {
            if(aggregation && aggregation.type === 'date') {
                switch (aggregation.date_type) {
                    case 'Year':
                        return '%Y';
                    case 'Quarter':
                        return '%m/%Y';
                    case 'Month':
                        return '%Y/%m';
                    case 'Week':
                        return 'Week %W';
                    case 'Day':
                        return '%x';
                    default:
                        return '%x';
                }
            } else return "";
        }
    });

    return Model;
});