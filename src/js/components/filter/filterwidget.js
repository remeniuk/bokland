/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        Filter = require('./view/filter'),
        FilterModel = require('./model/filter'),
        FilterSelection = require('./view/filterselection'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/filter/filterwidget'],

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var filterModel = new FilterModel();

            var filter = new Filter({
                state: _this.state,
                filterModel: filterModel
            });
            _this.region('filter').show(filter);

            var filterSelection = new FilterSelection({
                state: _this.state,
                filterModel: filterModel
            });
            _this.region('filter-selection').show(filterSelection);

            filterModel.fetch();

            return _this;
        }
    });

    return View;
});