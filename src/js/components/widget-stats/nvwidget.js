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

                function formatAxis(axisName, axisType) {
                    if (chart[axisName] && _this.widgetModel.get(axisType)[0]) {
                        chart[axisName].showMaxMin(false);

                        var dimension;

                        if(_.contains(['rows', 'cols'], axisType)) {
                            var dimensionName = _this.widgetModel.get(axisType)[0].dimension.fieldName;
                            dimension = _this.cube.dimension(dimensionName);
                        } else if(axisType === 'measures') {
                            var measureName = _this.widgetModel.get(axisType)[0];
                            dimension = _this.cube.measure(measureName);
                            dimension.type = 'number';
                        }

                        chart[axisName].axisLabel(dimension.name);
                        chart[axisName].tickFormat(_this._formatterFactory(dimension.type, dimension.format));
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