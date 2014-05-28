/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        $ = require('jquery'),
        pivottable = require('pivottable'),
        BaseView = require('libs/view'),
        templates = require('templates/templates');

    // code
    var __super__ = BaseView.prototype;
    var View = BaseView.extend({
        template: templates['components/widget-stats/funnel'],

        initialize: function (options) {
            var _this = this;

            _this.options = options;
            _this.state = options.state;
            _this.filterDataModel = options.filterDataModel;

            _this.listenTo(_this.filterDataModel, 'sync', _this.redraw);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            return _this;
        },

        redraw: function (data, filter) {
            var _this = this;

            var meta = {
                rows: ['cohort', 'users'],
                cols: ['event'],
                aggregator: $.pivotUtilities.aggregators.sum(['percent'])
            };

            var chartRegionSelector = '[data-region=chart]';

            $(chartRegionSelector).pivot(_this.filterDataModel.get('entries'), meta);

            return _this;
        }
    });

    return View;
});