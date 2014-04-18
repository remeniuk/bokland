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
                    values: _.map(d[1], function(d){
                        return {
                            x: d[0],
                            y: d[1]
                        };
                    }),
                    key: d[2]
                };
            });
        },

        createChart: function () {
            return nv.models.lineChart()
                .useInteractiveGuideline(true);
        }

    });

    return View;
});