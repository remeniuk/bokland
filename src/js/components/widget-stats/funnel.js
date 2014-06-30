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
            _this.funnelDataModel = options.funnelDataModel;

            _this.listenTo(_this.funnelDataModel, 'sync', _this.redraw);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            return _this;
        },

        redraw: function (data, filter) {
            var _this = this;

            var sum = function() {
                return function(_arg) {
                    var attr;
                    attr = _arg[0];
                    return function() {
                        return {
                            sum: 0,
                            push: function(record) {
                                if (!isNaN(parseFloat(record[attr]))) {
                                    return this.sum += parseFloat(record[attr]);
                                }
                            },
                            value: function() {
                                return this.sum;
                            },
                            format: function(v){
                                return $.pivotUtilities.numberFormat(2)(100 * v)+"%";
                            },
                            label: "Sum of " + attr
                        };
                    };
                };
            };

            var meta = {
                rows: ['cohort', 'users'],
                cols: ['event'],
                aggregator: sum()(["percent"])
            };

            var chartRegionSelector = '[data-region=chart]';

            var funnelEntries = _this.funnelDataModel.get('entries');
            if(funnelEntries) {
                $(chartRegionSelector).pivot(funnelEntries, meta);
            }

            return _this;
        }
    });

    return View;
});