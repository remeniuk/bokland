/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        RowChartWidget = require('components/widget-stats/rowchart'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/cell'],

        initialize: function (options) {
            var _this = this;

            _this.widget = options.widget;
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

            switch (widget.widgetType) {
                case 'row':
                    return new RowChartWidget({
                        collection: _this.collection,
                        name: widget.id,
                        state: _this.state.ref(widget.filterBy),
                        title: widget.title
                    });
            }
        }
    });

    return View;
});