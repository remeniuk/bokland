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
            return [
                {
                    values: _.map(data, function (d) {
                        return {
                            id: d[0],
                            value: d[1],
                            label: d[2]
                        };
                    })
                }
            ];
        },

        createChart: function () {
            return nv.models.multiBarHorizontalChart()
                .x(function(d) { return d.label;})
                .y(function(d) { return d.value; })
                .showValues(true)
                .tooltips(false)
                .showControls(false);
        }

    });

    return View;
});