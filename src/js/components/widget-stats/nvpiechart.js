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
            return _.map(data, function (d) {
                return {
                    id: d[0],
                    value: d[1],
                    label: d[2]
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