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

//            _this.listenTo(_this.chart, 'filter', function() {
//                var filter = _.clone(_this.chart.filter());
//                _this.state.set('_', filter);
//            });
        },

        redraw: function (data, filter) {
            var _this = this;

            var values = _.map(data, function (d) {
                return {
                    id: d[0],
                    values: d[1],
                    key: d[2]
                };
            });

            nv.addGraph(function () {
                var chart = nv.models.stackedAreaChart()
                    .margin({right: 100})
                    .x(function (d) {
                        return d[0]
                    })
                    .y(function (d) {
                        return d[1]
                    })
                    .useInteractiveGuideline(true)
                    .rightAlignYAxis(true)
                    .transitionDuration(500)
                    .showControls(true)
                    .clipEdge(true);

                var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';
                $(chartRegionSelector).html('<svg style="height: 300px"></svg>');

                chart.xAxis
                    .showMaxMin(false)
                    .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

                chart.yAxis
                    .tickFormat(d3.format(',.2f'));

                d3.select(chartRegionSelector + ' svg')
                    .datum(values)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
            }/*, function () {
             d3.selectAll(".discreteBar").on('click',
             function (e) {
             _this.state.set('_', [e.id]);
             });
             }*/);

            return _this;
        }

    });

    return View;
});