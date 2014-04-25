/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        WidgetModel = require('modules/dashboard/models/widget'),
        WidgetData = require('modules/dashboard/models/series'),
        RowModel = require('modules/dashboard/models/row'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/widget-builder/builderdialog'],

        widgetTypes: [
            { 'id': 'pivot', 'name': 'Pivot'},
            { 'id': 'row', 'name': 'Row chart'},
            { 'id': 'line', 'name': 'Line chart'},
            { 'id': 'bar', 'name': 'Bar chart'},
            { 'id': 'area', 'name': 'Area chart'},
            { 'id': 'pie', 'name': 'Pie chart'}
        ],

        widgetWidths: [
            1,2,3,4,5,6,7,8,9,10,11,12
        ],

        measureFuncs: [
            { 'id': 'sum', 'name': 'SUM()'},
            { 'id': 'avg', 'name': 'AVG()'},
            { 'id': 'count', 'name': 'COUNT()'}
        ],

        elementsUI: {
            'dialog': '#widget-builder',
            'cubeselect': '#widget-cube',
            'widgetname': '#widget-name',
            'widgettype': '#widget-type',
            'widgetrows': '#widget-rows',
            'widgetcols': '#widget-cols',
            'widgetmeasuresfield': '#widget-measures',
            'widgetmeasuresfunc': '#widget-measures-func',
            'widgetcolsgroup': '#widget-cols-group',
            'widgetwidth': '#widget-width',

            'save': '.btn-widget-save'
        },

        addNewWidgetMode: false,
        cubeSelected: null,

        events: {
            'change @ui.cubeselect': '_changeCube',
            'change @ui.widgetname': '_changeName',
            'change @ui.widgetwidth': '_changeWidth',
            'change @ui.widgettype': '_changeWidgetType',
            'click @ui.save': '_saveWidget'
        },

        initialize: function (options) {
            var _this = this;

            _this.widgetModel = options.widgetModel;
            _this.rowModel = options.rowModel;

            _this.cubes = options.cubes;
            _this.dashboard = options.dashboard;
            _this.dashboardData = options.dashboardData;

            if(!_this.widgetModel) {
                _this.widgetModel = new WidgetModel();
            }

            _this.addNewWidgetMode = _.isUndefined(_this.widgetModel.get('id'));

            console.log('init builder [widgetID: '+_this.widgetModel.get('id')+']');

            _this.listenToOnce(_this.widgetModel, 'sync', _this._onSave);

            if(_this.widgetModel.get('cubeId')) {
                _this.cubeSelected = _this.cubes.get(_this.widgetModel.get('cubeId'));
            } else {
                _this.cubeSelected = _this.cubes.at(0);
                _this.widgetModel.set('cubeId', _this.cubeSelected.get('id'))
            }

            _this.redraw();
        },

        redraw: function () {
            var _this = this;

            _this.$el.html(_this.template({
                cubes: _this.cubes.toJSON(),
                cubeMeta: _this.cubeSelected.toJSON(),
                widgetTypes: _this.widgetTypes,
                widgetWidths: _this.widgetWidths,
                measureFuncs: _this.measureFuncs,
                model: _this.widgetModel.toJSON()
            }));
            _this.bindUI();

            this._changeWidgetType();

            return _this;
        },

        _changeCube: function(){
            var _this = this,
                cubeId = _this.ui.$cubeselect.find(':selected').val();

            _this.widgetModel.set('cubeId', cubeId);
            _this.cubeSelected = _this.cubes.get(cubeId);
            _this.redraw()
        },

        _changeName: function(){
            var _this = this;
            _this.widgetModel.set('name', _this.ui.$widgetname.val());
        },

        _changeWidth: function(){
            var _this = this;
            _this.widgetModel.set('width', _this.ui.$widgetwidth.find(':selected').val());
        },

        _changeWidgetType: function(){
            var _this = this,
                type = _this.ui.$widgettype.find(':selected').val();

            _this.widgetModel.set('widgetType', type);

            if(_this._hasCols(type)) {
                _this.ui.$widgetcolsgroup.show();
            } else {
                _this.ui.$widgetcolsgroup.hide()
            }
        },

        _saveWidget: function() {
            var _this = this,
                widgetId = _this.widgetModel.get('id'),
                type = _this.ui.$widgettype.find(':selected').val(),
                selectedRow = _this.ui.$widgetrows.find(':selected').val(),
                selectedCol = _this.ui.$widgetcols.find(':selected').val(),
                selectedMeasure = {
                    field: _this.ui.$widgetmeasuresfield.find(':selected').val(),
                    fund: _this.ui.$widgetmeasuresfunc.find(':selected').val()
                };

            _this.widgetModel.set({
                filterBy: '',
                xAxis: {
                    type: '',
                    format: '',
                    label: _this._hasCols(type) ? selectedCol : ''
                },
                yAxis: {
                    type: '',
                    format: '',
                    label: selectedRow
                },
                rows: [selectedRow],
                measures: [selectedMeasure],
                cols: _this._hasCols(type) ? [selectedCol] : []
            });

            //TODO _this.widgetModel.save();
            _this.widgetModel.trigger('sync');
        },

        _onSave: function() {
            var _this = this,
                widgetId = _this.widgetModel.get('id'),
                widgets = _this.rowModel.get('widgets');

            if(_this.addNewWidgetMode) {
                _this.widgetModel.set('id', '1111111111111111111111111111'); // test id

                widgets.push(_this.widgetModel.toJSON());
                _this.rowModel.set('widgets', widgets);

                _this.rowModel.trigger('addWidget', _this.widgetModel.toJSON());
            } else {
                widgets = _.map(widgets, function(widget) {
                    return ((widget.id === widgetId) ? _this.widgetModel.toJSON() : widget);
                });
                _this.rowModel.set('widgets', widgets);

                _this.widgetModel.trigger('updateWidget');
            }
        },


        _hasCols: function(type) {
            return !(type === 'pie' || type === 'row' || type === 'bar');
        }


    });

    return View;
});