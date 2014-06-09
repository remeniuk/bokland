/* global define */
define(function (require) {
    'use strict';

    // imports
    var $               = require('jquery'),
        _               = require('underscore'),
        config          = require('config/api'),
        BaseView        = require('libs/view'),
        TemplateCell    = require('components/template/templatecell'),
        WidgetModel     = require('components/widget-builder/model/widget'),
        WidgetData      = require('modules/dashboard/models/series'),
        RowModel        = require('modules/dashboard/models/row'),
        templates       = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/row'],

        elementsUI: {
            'addWidget': '[data-action="add-widget"]',
            'editRow': '[data-action="edit-row"]',
            'removeRow': '[data-action="remove-row"]'
        },

        events: {
            'click @ui.addWidget': '_addWidget',
            'click @ui.editRow': '_editRow',
            'click @ui.removeRow': '_removeRow'
        },

        initialize: function (options) {
            var _this = this;

            _this.rowNum = options.rowNum;
            _this.rowModel = options.rowMeta ? new RowModel(options.rowMeta) : new RowModel({widgets: []});
            _this.dashboardMetaModel = options.metaModel;
            _this.cube = options.cube;
            _this.collection = options.collection;
            _this.builderView = options.builderView;
            _this.editRowView = options.editRowView;
            _this.state = options.state;
            _this.cells = [];


            _this.listenTo(_this.rowModel, 'addWidget', _this._onWidgetAdded);
            _this.listenTo(_this.rowModel, 'rowUpdated', _this._onRowUpdated);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            _.each(_this.rowModel.get('widgets'), _this.addCell, _this);

            return _this;
        },

        addCell: function (widgetMeta) {
            var _this = this,
                widgetModel = new WidgetModel(widgetMeta);

            widgetMeta.id = widgetModel.get('_id').$oid;

            var cellElement = new TemplateCell({
                widget: widgetMeta,
                widgetModel: widgetModel,
                height: _this.rowModel.get('height'),
                dashboardMetaModel: _this.dashboardMetaModel,
                collection: _this.collection,
                widgetBuilderView: _this.builderView,
                cube: _this.cube,
                rowNum: _this.rowNum,
                rowModel: _this.rowModel,
                state: _this.state
            });

            _this.cells.push(cellElement);

            _this.$el.children('.row').append(cellElement.$el);

            cellElement.render();

            return widgetModel;
        },

        clearCells: function(){
            var _this = this;

            _.each(_this.cells, function(cell){
                cell.clear();
                cell.dispose();
            });
            _this.cells.length = 0;
        },

        _addWidget: function () {
            var _this = this;

            if(_this.builderView) {
                _this.builderView.reinit({
                    widgetModel: new WidgetModel(),
                    rowModel: _this.rowModel
                });
            }
        },

        _editRow: function () {
            var _this = this;

            if(_this.editRowView) {
                _this.editRowView.reinit({
                    rowNum: _this.rowNum,
                    rowModel: _this.rowModel
                });
            }
        },

        _removeRow: function () {
            var _this = this;

            if (confirm('Do you really want to remove the whole row?')) {
                _this.dashboardMetaModel.trigger('rowremoved', _this.rowNum);
                _this.clearCells();
                _this.dispose();
            }
        },

        _onRowUpdated: function() {
            var _this = this;

            _this.clearCells();

            _this.$el.html(_this.template({}));
            _this.bindUI();

            _.each(_this.rowModel.get('widgets'), function(widget){
                var widgetModel = _this.addCell(widget);
                widgetModel.trigger('redrawWidget');
            });

            _this._refreshMetaModel();
        },

        _onWidgetAdded: function(widgetMeta) {
            var _this = this,
                widgetId = widgetMeta.id || (widgetMeta._id || {}).$oid;

            if(widgetId) {
                var widgetData = new WidgetData({id: widgetMeta.id}),
                    widgets = _this.rowModel.get('widgets');

                widgets.push(widgetMeta);
                _this.rowModel.set('widgets', widgets);
                _this.dashboardMetaModel.get('rows')[_this.rowNum] = _this.rowModel.toJSON();
                _this._refreshMetaModel();

                _this.listenToOnce(widgetData, 'sync', function(){
                    _this.collection.push(widgetData);
                    var newWidgetModel = _this.addCell(widgetMeta);
                    newWidgetModel.trigger('redrawWidget');
                });

                widgetData.fetch({data: _this.state.serialize()});
            }
        },

        _refreshMetaModel: function() {
            var _this = this;

            if(!config.stubs) {
                _this.dashboardMetaModel.save(null, {success: function(model,response){
                    model.set('id', (response || {data:{}}).data._id);
                }});
            }
        }
    });

    return View;
});