/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        d3 = require('d3'),
        nv = require('nvd3'),
        $ = require('jquery'),
        NvWidget = require('./nvwidget'),
        templates = require('templates/templates');

    var View = NvWidget.extend({

        parseData: function (data) {
            var _this = this;

            var row = _this.widgetModel.get('cols')[0];
            var rowAgg = row.aggregation;
            var rowName = row.dimension.field;
            var measureName = _this.widgetModel.get('measures')[0];

            var values = _.map(data, function (d) {
                return {
                    value: d[measureName],
                    label: _this.cube.dimensionValueLabel(rowName, d[rowName], rowAgg)
                };
            });

            values = _.sortBy(values, function(d){
                return d.label;
            });

            return [
                {
                    values: values
                }
            ];
        },

        createChart: function () {
            return nv.models.discreteBarChart()
                .x(function (d) {
                    return d.label;
                })
                .y(function (d) {
                    return d.value;
                })
                .margin({bottom: 60, left: 80})
                .staggerLabels(true)
                .tooltips(false)
                .showValues(true)
                .color(this.COLORS)
                .transitionDuration(350);
        }

    });

    return View;
});