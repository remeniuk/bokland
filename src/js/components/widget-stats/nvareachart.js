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

            var colName = _this.widgetModel.get('cols')[0].dimension.field;
            var seriesName = _this.widgetModel.get('rows')[0] ? _this.widgetModel.get('rows')[0].dimension.field : undefined;
            var seriesAgg = (_this.widgetModel.get('rows')[0] || {}).aggregation;

            var measureName = _this.widgetModel.get('measures')[0];

            function parseSeries(series, key) {
                var dimension = _this.cube.dimension(colName);

                if(dimension.type === 'date') {
                    series = _.sortBy(series, function(s){
                        return s[colName];
                    });
                }

                return {
                    key: seriesName ? _this.cube.dimensionValueLabel(seriesName, key, seriesAgg) : undefined,
                    values: _.map(series, function (d) {
                        return [d[colName], d[measureName]];
                    })
                };
            }

            if (seriesName) {
                var series = _.groupBy(data, function (d) {
                    return d[seriesName];
                });
                return _.map(series, function (value, key) {
                    return parseSeries(value, key);
                });
            } else {
                return [ parseSeries(data) ];
            }
        },

        createChart: function () {
            var _this = this,
                colAgg = _this.widgetModel.get('cols')[0].aggregation,
                dateFormat = _this.cube.aggFormat(colAgg),
                chart = nv.models.stackedAreaChart()
                    .margin({right: 100})
                    .x(function (d) {
                        return d[0];
                    })
                    .y(function (d) {
                        return d[1];
                    })
                    .useInteractiveGuideline(true)
                    .rightAlignYAxis(true)
                    .transitionDuration(500)
                    .showControls(true)
                    .color(this.COLORS)
                    .clipEdge(false);

            chart.xAxis.tickFormat(function(d) {
                return d3.time.format(dateFormat)(new Date(d));
            });

            return chart;
        }

    });

    return View;
});