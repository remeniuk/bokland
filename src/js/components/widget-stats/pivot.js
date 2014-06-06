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

            var rows = _this.widgetModel.get('rows');
            var cols = _this.widgetModel.get('cols');
            var measures = _this.widgetModel.get('measures');

            var rowLabels = _.map(rows, function(row) { return _this.cube.dimensionLabel(row.dimension.field); });
            var colLabels = _.map(cols, function(col) { return _this.cube.dimensionLabel(col.dimension.field); });

            var values = _.map(data, function (d) {
                _.each(rows, function(row) {
                    var field = row.dimension.field;
                    d[_this.cube.dimensionLabel(field)] = _this.cube.dimensionValueLabel(field, d[field], row.aggregation);
                });

                _.each(cols, function(col) {
                    var field = col.dimension.field;
                    d[_this.cube.dimensionLabel(field)] = _this.cube.dimensionValueLabel(field, d[field], col.aggregation);
                });

                return d;
            });

            var meta = {
                rows: rowLabels,
                cols: colLabels,
                aggregator: $.pivotUtilities.aggregators.sum(measures)
            };

            var chartRegionSelector = '[name="' + _this.name + '"] [data-region=chart]';

            $(chartRegionSelector).pivot(values, meta);

            return _this;
        }

    });

    return View;
});