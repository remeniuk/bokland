/* global define */
define(function (require) {
    'use strict';

    // imports
    var $                   = require('jquery'),
        _                   = require('underscore'),
        BaseView            = require('libs/view'),
        NvBarChartWidget    = require('components/widget-stats/nvbarchart'),
        NvRowChartWidget    = require('components/widget-stats/nvrowchart'),
        NvAreaChartWidget   = require('components/widget-stats/nvareachart'),
        NvPieChartWidget    = require('components/widget-stats/nvpiechart'),
        NvLineChartWidget   = require('components/widget-stats/nvlinechart'),
        PivotWidget         = require('components/widget-stats/pivot'),
        WidgetData          = require('modules/dashboard/models/series'),
        templates           = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/cell'],

        activeVeiew: null,

        initialize: function (options) {
            var _this = this;

            _this.widget = options.widget;
            _this.widgetModel = options.widgetModel;
            _this.height = options.height;
            _this.dashboardMetaModel = options.dashboardMetaModel;
            _this.widgetBuilderView = options.widgetBuilderView;
            _this.rowNum = options.rowNum;
            _this.rowModel = options.rowModel;
            _this.cube = options.cube;

            _this.listenTo(_this.widgetModel, 'updateWidget', _this._onWidgetUpdated)
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template(_this.widget));

            if(_this.activeVeiew) {
                _this.activeVeiew.stopListening();
                _this.activeVeiew.remove();
            }
            _this.activeVeiew = _this._widgetFactory(_this.widget);
            _this.region('widget').show(_this.activeVeiew);

            return _this;
        },

        _widgetFactory: function (widget) {
            var _this = this;
            var widgetState = {
                collection: _this.collection,
                dashboardMetaModel: _this.dashboardMetaModel,
                widgetBuilderView: _this.widgetBuilderView,
                cube: _this.cube,
                rowModel: _this.rowModel,
                widgetModel: _this.widgetModel,
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
        },

        _onWidgetUpdated: function() {
            var _this = this,
                widgetId = _this.widgetModel.get('id'),
                widgetData = new WidgetData({id: widgetId});

            _this._refreshMetaModel();

            _this.listenToOnce(widgetData, 'sync', function(){
                // TODO uncomment when server api is ready
                //_this.collection.remove(_this.collection.get(widgetId));
                //_this.collection.add(widgetData);

                _this.widget = _this.widgetModel.toJSON();

                _this.clearRegions();
                _this.render();

                //_this.collection.trigger('sync');
                _this.widgetModel.trigger("redrawWidget");
            });

            widgetData.fetch()
        },

        _refreshMetaModel: function() {
            var _this = this;

            _this.dashboardMetaModel.get('rows')[_this.rowNum] = _this.rowModel.toJSON();
            //TODO _this.metaModel.save({trigger: false});
        }
    });

    return View;
});