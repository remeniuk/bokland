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

            var rowName = _this.widgetModel.get('rows')[0].dimension.fieldName;
            var measureName = _this.widgetModel.get('measures')[0];

            return _.map(data, function (d) {
                return {
                    value: d[measureName],
                    label: _this.cube.dimensionValueLabel(rowName, d[rowName])
                };
            });
        },

        createChart: function () {
            return nv.models.pieChart()
                .x(function(d) { return d.label; })
                .y(function(d) { return d.value; })
                .showLabels(true);
        }

    });

    return View;
});