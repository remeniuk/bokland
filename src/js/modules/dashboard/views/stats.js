/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        Filter = require('components/filter/filter'),
        FilterModel = require('modules/dashboard/models/filter'),
        TemplateMetaModel = require('modules/dashboard/models/templatemeta'),
        TemplateCell = require('components/template/templatecell'),
        FilterSelection = require('components/filterselection/pane'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['modules/dashboard/stats'],

        elementsUI: {
            'filterPopover': '[data-toggle=popover]',
            'dashboardTitle': '[data-region=title]'
        },

        initialize: function (options) {
            var _this = this;

            _this.state.init({
                d: {},  // date
                p: {},  // platform
                s: {},  // source
                c: {},  // countries
                ch: {}  // segments
            });

            _this.collection = options.collection;

            _this.metaModel = new TemplateMetaModel();
            _this.metaModel.set('id', options.id);

            _this.listenTo(_this.metaModel, 'sync', _this.redraw);

            _this.metaModel.fetch();
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
        },

        redraw: function () {
            var _this = this;

            var $rowsHtml = $('<div></div>');

            _this.ui.$dashboardTitle.html(_this.metaModel.get('title'));

            _.each(_this.metaModel.get('rows'), function (row) {
                var $rowHtml = $('<div class="row"></div>');

                _.each(row.widgets, function (widgetMeta) {
                    $rowHtml.append(new TemplateCell({
                        widget: widgetMeta,
                        height: row.height,
                        collection: _this.collection
                    }).render().$el.html());
                });

                $rowsHtml.append($rowHtml);
            });

            _this.$el.find('[data-region="rows"]').html($rowsHtml);
        }
    });

    return View;
});