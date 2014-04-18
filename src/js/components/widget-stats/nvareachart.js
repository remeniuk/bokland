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
                    values: d[1],
                    key: d[2]
                };
            });
        },

        createChart: function () {
            return nv.models.stackedAreaChart()
                .margin({right: 100})
                .x(function (d) {
                    return d[0];
                })
                .y(function (d) {
                    return d[1];
                })
                .useInteractiveGuideline(true)
                .rightAlignYAxis(true)
                .transitionDuration(500)
                .showControls(true)
                .clipEdge(true);
        }

    });

    return View;
});