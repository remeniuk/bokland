/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        FilterWidget = require('components/filter/filterwidget'),
        TemplateMetaModel = require('modules/dashboard/models/templatemeta'),
        TemplateRow = require('components/template/templaterow'),
        AddRowDialog = require('components/template/addrow'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['modules/dashboard/stats'],
        rowTemplate: templates['components/template/row'],

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

            _this.metaModel = new TemplateMetaModel();
            _this.metaModel.set('id', options.id);

            _this.listenTo(_this.metaModel, 'sync', _this.redraw);
            _this.listenTo(_this.metaModel, 'rowadded', _this._addRow);

            _this.metaModel.fetch();
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var filterWidget = new FilterWidget({
                state: _this.state
            });
            _this.region('filter').show(filterWidget);

            var addRowDialog = new AddRowDialog({
                model: _this.metaModel
            });
            _this.region('add-row').show(addRowDialog);

            return _this;
        },

        redraw: function () {
            var _this = this;

            _this.ui.$dashboardTitle.html(_this.metaModel.get('title'));

            _this.$el.find('[data-region="rows"]').empty();

            _.each(_this.metaModel.get('rows'), function (row, i) {
                _this._addRow(i);
            });
        },

        _addRow: function (rowNum) {
            var _this = this;

            var rowElement = new TemplateRow({
                metaModel: _this.metaModel,
                rowNum: _.isUndefined(rowNum) ? (_this.metaModel.get('rows').length - 1) : rowNum,
                collection: _this.collection
            });

            _this.$el.find('[data-region="rows"]').append(rowElement.$el);

            rowElement.render();
        }
    });

    return View;
});