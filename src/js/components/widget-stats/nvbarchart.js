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
                    value: d[1],
                    label: d[2]
                };
            });

            nv.addGraph(function () {
                var chart = nv.models.discreteBarChart()
                    .x(function (d) {
                        return d.label
                    })
                    .y(function (d) {
                        return d.value
                    })
                    .staggerLabels(true)
                    .tooltips(false)
                    .showValues(true)
                    .transitionDuration(350);

                var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';

                $(chartRegionSelector).html('<svg></svg>');
                d3.select(chartRegionSelector + ' svg')
                    .datum([
                        {
                            key: _this.title,
                            values: values
                        }
                    ])
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