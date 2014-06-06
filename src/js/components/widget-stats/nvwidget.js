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

    var $lime = '#8CBF26',
        $red = '#e5603b',
        $redDark = '#d04f4f',
        $blue = '#6a8da7',
        $green = '#56bc76',
        $orange = '#eac85e',
        $pink = '#E671B8',
        $purple = '#A700AE',
        $brown = '#A05000',
        $teal = '#4ab0ce',
        $gray = '#666',
        $white = '#eee',
        $textColor = $gray;

    // code
    var __super__ = WidgetView.prototype;
    var View = WidgetView.extend({
        COLORS: [$blue, $orange, $green, $teal, $red, $lime, $white, $redDark],

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

                function formatAxis(axisName, axisType) {
                    var axis = _this.widgetModel.get(axisType)[0];
                    if (chart[axisName] && axis) {
                        chart[axisName].showMaxMin(false);

                        var dimension;

                        if(_.contains(['rows', 'cols'], axisType)) {
                            var dimensionName = axis.dimension.field;
                            dimension = _this.cube.dimension(dimensionName);
                        } else if(axisType === 'measures') {
                            var measureName = axis;
                            dimension = _this.cube.measure(measureName);
                            dimension.type = 'number';
                        }

                        chart[axisName].axisLabel(dimension.name);
                        //chart[axisName].tickFormat(_this._formatterFactory(dimension.type, aggFormat || dimension.format));
                    }
                }

                if(_.contains(['bar', 'line', 'area'], _this.widgetModel.get('widgetType'))){
                    formatAxis('yAxis', 'measures');
                } else {
                    formatAxis('yAxis', 'rows');
                }

                if(_.contains(['row'], _this.widgetModel.get('widgetType'))){
                    formatAxis('xAxis', 'measures');
                } else {
                    formatAxis('xAxis', 'cols');
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
        }
    });

    return View;
});