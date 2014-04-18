/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        NvBarChartWidget = require('components/widget-stats/nvbarchart'),
        NvRowChartWidget = require('components/widget-stats/nvrowchart'),
        NvAreaChartWidget = require('components/widget-stats/nvareachart'),
        NvPieChartWidget = require('components/widget-stats/nvpiechart'),
        NvLineChartWidget = require('components/widget-stats/nvlinechart'),
        PivotWidget = require('components/widget-stats/pivot'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/cell'],

        initialize: function (options) {
            var _this = this;

            _this.widget = options.widget;
            _this.height = options.height;

            _this.collection = options.collection;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template(_this.widget));
            _this.region('widget').show(_this._widgetFactory(_this.widget));

            return _this;
        },

        _widgetFactory: function (widget) {
            var _this = this;
            var widgetState = {
                collection: _this.collection,
                name: widget.id,
                state: _this.state.ref(widget.filterBy),
                title: widget.title,
                height: _this.height,
                xAxis: widget.xAxis,
                yAxis: widget.yAxis
            };

            switch (widget.widgetType) {
                case 'bar':
                    return new NvBarChartWidget(widgetState);
                case 'area':
                    return new NvAreaChartWidget(widgetState);
                case 'pie':
                    return new NvPieChartWidget(widgetState);
                case 'row':
                    return new NvRowChartWidget(widgetState);
                case 'line':
                    return new NvLineChartWidget(widgetState);
                case 'pivot':
                    return new PivotWidget(widgetState);
            }
        }
    });

    return View;
});