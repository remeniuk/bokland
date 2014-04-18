/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        $ = require('jquery'),
        pivottable = require('pivottable'),
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

            var values = _.map(data, function (d) {
                return _.map(d[1], function (d) {
                    var tuple = {};

                    var isDefined = function (value) {
                        return !_.isUndefined(value) && value !== '';
                    };

                    tuple[_this.options.xAxis.label] =
                        isDefined(_this.options.xAxis.format) ? _this._formatterFactory(_this.options.xAxis)(d[0]) : d[0];
                    tuple[_this.options.yAxis.label] =
                        isDefined(_this.options.yAxis.format) ? _this._formatterFactory(_this.options.yAxis)(d[1]) : d[1];

                    tuple.value = d[2];
                    return tuple;
                });
            });

            var meta = {
                rows: [_this.options.xAxis.label],
                cols: [_this.options.yAxis.label],
                aggregator: $.pivotUtilities.aggregators.sum(['value'])
            };

            var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';

            $(chartRegionSelector).pivot(values[0], meta);

            return _this;
        }

    });

    return View;
});