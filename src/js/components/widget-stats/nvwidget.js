/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        d3 = require('d3'),
        nv = require('nvd3'),
        $ = require('jquery'),
        WidgetView = require('./widget'),
        templates = require('templates/templates');


    // code
    var __super__ = WidgetView.prototype;
    var View = WidgetView.extend({
        initialize: function (options) {
            var _this = this;

            __super__.initialize.call(_this, options);

            _this.state = options.state;
        },

        redraw: function (data, filter) {
            var _this = this;

            var values = _this.parseData(data);

            nv.addGraph(function () {
                var chart = _this.createChart();

                var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';
                $(chartRegionSelector).html('<svg style="height:' + _this.options.height + '"></svg>');

                if (chart.xAxis) {
                    chart.xAxis.showMaxMin(false);
                    if(!_.isUndefined(_this.options.xAxis.label) && _this.options.xAxis.label !== ''){
                        chart.xAxis.axisLabel(_this.options.xAxis.label);
                    }
                    if(!_.isUndefined(_this.options.xAxis.format) && _this.options.xAxis.format !== ''){
                        chart.xAxis.tickFormat(_this._formatterFactory(_this.options.xAxis));
                    }
                }

                if (chart.yAxis) {
                    chart.yAxis.showMaxMin(false);
                    if(!_.isUndefined(_this.options.yAxis.label) && _this.options.yAxis.label !== ''){
                        chart.yAxis.axisLabel(_this.options.yAxis.label);
                    }
                    if(!_.isUndefined(_this.options.yAxis.format) && _this.options.yAxis.format !== ''){
                        chart.yAxis.tickFormat(_this._formatterFactory(_this.options.yAxis));
                    }
                }

                d3.select(chartRegionSelector + ' svg')
                    .datum(values)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            });

            return _this;
        },

        parseData: function (data) {
        },

        createChart: function () {
        },

        formatterFactory: function (axis) {
            switch (axis.type) {
                case 'date':
                    return function (d) {
                        return d3.time.format(axis.format)(new Date(d));
                    };
                default:
                    return d3.format(axis.format);
            }
        }
    });

    return View;
});