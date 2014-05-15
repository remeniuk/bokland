/* global define */
define(function (require) {
    'use strict';

    // imports
    var $           = require('jquery'),
        _           = require('underscore'),
        config      = require('config/api'),
        bootstrap   = require('bootstrap'),
        select2     = require('select2'),
        BaseView    = require('libs/view'),
        WidgetModel = require('components/widget-builder/model/widget'),
        RulesModel  = require('components/widget-builder/model/rules'),
        templates   = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/widget-builder/builderdialog'],
        tplDim: templates['components/widget-builder/dimension'],

        elementsUI: {
            'dialog': '#widget-builder',
            'widgettitle': '#widget-title',
            'widgettype': '#widget-type',
            'widgetrows': '.widget-rows',
            'widgetcols': '.widget-cols',
            'widgetmeasures': '.widget-measures',
            'widgetwidth': '#widget-width',
            'dimensions': '.dimensions',
            'btn-add-dim': '.btn-add-dim',
            'btn-remove-dim': '.btn-remove-dim',

            'save': '.btn-widget-save'
        },

        events: {
            'change @ui.widgettitle': '_changeTitle',
            'change @ui.widgetwidth': '_changeWidth',
            'change @ui.widgettype': '_changeWidgetType',
            'change @ui.widgetmeasures': '_changeWidgetMeasures',
            'change @ui.dimensions': '_changeDimension',
            'click @ui.btn-add-dim': '_addDimension',
            'click @ui.btn-remove-dim': '_removeDimension',
            'click @ui.save': '_saveWidget'
        },

        addNewWidgetMode: false,
        rules: null,

        initialize: function (options) {
            var _this = this;

            _this.stopListening();

            _this.cube = options.cube;

            _this._initBuilder(options);

            _this.rules = new RulesModel();
            _this.rules.fetch();
            _this.listenToOnce(_this.rules, 'sync', _this.redraw);
        },

        reinit: function (options) {
            var _this = this;

            _this._initBuilder(options);

            _this.redraw();
        },

        _initBuilder: function (options) {
            var _this = this;

            _this.stopListening();

            _this.widgetModel = options.widgetModel;
            _this.rowModel = options.rowModel;

            if(!_this.widgetModel) {
                _this.widgetModel = new WidgetModel();
            }

            _this.addNewWidgetMode = _.isUndefined(_this.widgetModel.get('_id'));

            var _id = _this.widgetModel.get('_id') || { };
            console.log('init builder [widgetID: ' + (_id.$oid || 'none') + ']');
            if(_id.$oid) {
                _this.widgetModel.set('id', _id.$oid);
            }

            _this.listenToOnce(_this.widgetModel, 'sync', _this._onSave);
        },

        redraw: function () {
            var _this = this;

            _this.$el.html(_this.template({
                cubeMeta: _this.cube.toJSON(),
                rules: _this.rules.toJSON(),
                model: _this.widgetModel.toJSON(),
                tplDim: _this.tplDim
            }));
            _this.bindUI();

            var currentWidgetType = _this.widgetModel.get('widgetType') || _this.rules.get('widgetTypes')[0].id;
            var maxMeasures = _this.rules.get('formRules')[currentWidgetType].measures.max;

            _this.ui.$widgetmeasures.val(_this.widgetModel.get('measures')).select2({
                maximumSelectionSize: maxMeasures
            });

            return _this;
        },

        _changeTitle: function(){
            var _this = this;
            _this.widgetModel.set('title', _this.ui.$widgettitle.val());
        },

        _changeWidth: function(){
            var _this = this;
            _this.widgetModel.set('width', parseInt(_this.ui.$widgetwidth.find(':selected').val()));
        },

        _changeWidgetType: function(){
            var _this = this,
                type = _this.ui.$widgettype.find(':selected').val(),
                measures = (_this.ui.$widgetmeasures.val() || []).slice(0,1);

            _this.widgetModel.set({ widgetType: type, rows: [], cols: [], measures: measures });

            _this.redraw();
        },

        _changeWidgetMeasures: function(){
            var _this = this,
                measures = _this.ui.$widgetmeasures.val();

            _this.widgetModel.set('measures', measures);

            _this.redraw();
        },

        _changeDimension: function(e){
            var _this = this,
                $el = $(e.target),
                dimType = $el.data('dim-type'),
                dimIndex = $el.data('index'),
                dims = _this.widgetModel.get(dimType);

            dims[dimIndex] = { dimension: { field: $el.find(':selected').val() } };

            _this.redraw();
        },

        _addDimension: function(e) {
            var _this = this,
                $el = $(e.target).closest('.dim-row').find('.dimensions'),
                dimType = $el.data('dim-type'),
                dims = _this.widgetModel.get(dimType);

            dims.push({ dimension: { field: '' } });

            _this.redraw();
        },

        _removeDimension: function(e) {
            var _this = this,
                $el = $(e.target).closest('.dim-row').find('.dimensions'),
                dimType = $el.data('dim-type'),
                dimIndex = $el.data('index'),
                dims = _this.widgetModel.get(dimType);

            dims.splice(dimIndex, 1);

            _this.redraw();
        },

        _saveWidget: function() {
            var _this = this,
                selectedRows = _this.ui.$widgetrows ? _.map(_this.ui.$widgetrows, _this._collectDimForm) : [],
                selectedCols = _this.ui.$widgetcols ? _.map(_this.ui.$widgetcols, _this._collectDimForm) : [],
                selectedMeasures = _this.ui.$widgetmeasures.val();

            _this.widgetModel.set({
                filterBy: '',
                rows: selectedRows,
                measures: selectedMeasures,
                cols: selectedCols
            });

            if(config.stubs) {
                _this.widgetModel.trigger('sync');
            } else {
                _this.widgetModel.save(null,
                    {
                        success : function(model, response) {
                            var id = response.data._id;
                            console.log("saved widget id: " + id);
                            _this.widgetModel.set('id', id);
                            _this.widgetModel.set('_id', { '$oid': id });
                        }
                    });
            }

        },

        _onSave: function() {
            var _this = this,
                widgetId = _this.widgetModel.get('id'),
                widgets = _this.rowModel.get('widgets');

            if(_this.addNewWidgetMode) {
                if(config.stubs) {
                    _this.widgetModel.set('id', '1111111111111111111111111111'); // test id
                    _this.widgetModel.set('_id', { '$oid': '1111111111111111111111111111' }); // test id
                } else if(!widgetId) {
                    var _id = _this.widgetModel.get('_id') || { };
                    console.log('on saved widget [widgetID: ' + (_id.$oid || 'none') + ']');
                    if (_id.$oid) {
                        _this.widgetModel.set('id', _id.$oid);
                    }
                }

                _this.rowModel.trigger('addWidget', _this.widgetModel.toJSON());
            } else {
                widgets = _.map(widgets, function(widget) {
                    return ((widget.id === widgetId) ? _this.widgetModel.toJSON() : widget);
                });
                _this.rowModel.set('widgets', widgets);

                _this.widgetModel.trigger('updateWidget');
            }
        },

        _collectDimForm: function(row){
            var $row = $(row),
                $parent = $(row).closest('.dim-row'),
                dim = $(row).find(':selected').val(),
                aggType = $parent.find('.dim-agg-type').find(':selected').val(),
                aggParam = $parent.find('.dim-agg-param').find(':selected').val() ||
                    $parent.find('.dim-agg-param').val(),
                rowMeta = { dimension: { field: dim }, aggregation: { type: aggType}};
            if(aggType === 'date') {
                /* jshint camelcase:false */
                rowMeta.aggregation.date_type = aggParam;
                /* jshint camelcase:true */
            }
            return rowMeta;
        }

    });

    return View;
});