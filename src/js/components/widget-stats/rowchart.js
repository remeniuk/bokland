/* global define */
define(function(require) {
    'use strict';

    // imports
    var _          = require('underscore'),
        d3         = require('d3'),
        RowChart   = require('components/charts/rowchart-simple'),
        WidgetView = require('./widget'),
        templates  = require('templates/templates');


    // code
    var __super__ = WidgetView.prototype;
    var View = WidgetView.extend({
        initialize: function(options) {
            var _this = this;

            __super__.initialize.call(_this, options);

            _this.chart = new RowChart({
                max: options.max || -1
            });

            _this.listenTo(_this.chart, 'filter', function() {
                var filter = _.clone(_this.chart.filter());
                _this.state.set('_', filter);
            });
        },

        render: function() {
            var _this = this,
                options = _this.options;

            // init chart
            _this.region('chart').show(_this.chart);

            return _this;
        },

        redraw: function(data, filter) {
            var _this = this;

            data = _.map(data, function(d) {
                return {
                    id: d[0],
                    value: d[1],
                    name: d[2]
                };
            });

            _this.chart
                .data(data, {redraw: false})
                .filter(filter, {silent: true});

            return _this;
        },

        _resize: function() {
            var _this = this;

            _this.chart.resize();

            return _this;
        }

    });

    return View;
});