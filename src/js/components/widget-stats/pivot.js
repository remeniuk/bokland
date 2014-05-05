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

            var rows = _.map(_this.widgetModel.get("rows"), function(r){ return r.dimension.fieldName; });
            var cols = _.map(_this.widgetModel.get("cols"), function(r){ return r.dimension.fieldName; })

            var rowLabels = _.map(rows, function(row) { return _this.cube.dimensionLabel(row); });
            var colLabels = _.map(cols, function(col) { return _this.cube.dimensionLabel(col); });

            var values = _.map(data, function (d) {
                _.each(rows, function(row) {
                    d[_this.cube.dimensionLabel(row)] = _this.cube.dimensionValueLabel(row, d[row]);
                });

                _.each(cols, function(col) {
                    d[_this.cube.dimensionLabel(col)] = _this.cube.dimensionValueLabel(col, d[col]);
                });

                return d;
            });

            var meta = {
                rows: rowLabels,
                cols: colLabels,
                aggregator: $.pivotUtilities.aggregators.sum(_this.widgetModel.get("measures"))
            };

            var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';

            $(chartRegionSelector).pivot(values, meta);

            return _this;
        }

    });

    return View;
});