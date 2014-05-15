/* global define */
define(function (require) {
    'use strict';

    // imports
    var $         = require('jquery'),
        d3        = require('d3'),
        _         = require('underscore'),
        config    = require('config/api'),
        BaseView  = require('libs/view'),
        templates = require('templates/templates');


    // code
    var __super__ = BaseView.prototype;
    var View = BaseView.extend({
        template: templates['components/widget-stats/chart'],

        className: 'component-widget',

        options: {
            name: null,
            title: ''
        },

        elementsUI: {
            'display': null,
            'edit': '[data-action="edit-widget"]',
            'remove': '[data-action="remove-widget"]'
        },

        events: {
            'click @ui.edit': 'editWidget',
            'click @ui.remove': 'removeWidget'
        },

        initialize: function (options) {
            var _this = this;

            _this.options = options;
            _this.name = options.name;
            _this.title = options.title;
            _this.dashboardMetaModel = options.dashboardMetaModel;
            _this.widgetBuilderView = options.widgetBuilderView;
            _this.rowModel = options.rowModel;
            _this.cube = options.cube;
            _this.widgetModel = options.widgetModel;

            _this._data = null;

            _this.state.init({
                _: [],
                opt: {}
            });

            _this.listenTo(_this.collection, 'sync', function () {
                var collection = _this.collection,
                    data = collection.get(_this.name),
                    filter = _this.state.get('_');

                if (data) {
                    _this._data = data.get('data');
                    _this.redraw(data.get('data'), filter);
                }
            });

            _this.listenTo(_this.state, 'change', function () {
                if (_this._data) {
                    var filter = _this.state.get('_');
                    _this.redraw(_this._data, filter);
                }
            });

            _this.listenTo(_this.widgetModel, 'redrawWidget', function () {
                var collection = _this.collection,
                    data = collection.get(_this.name),
                    filter = _this.state.get('_');

                if (data) {
                    console.log('redrawing widget ' + _this.widgetModel.get('id'));
                    _this._data = data.get('data');
                    _this.redraw(_this._data, filter);
                }
            });

            $(window).on('resize.' + _this.cid, _.throttle(_this._resize.bind(_this), 100));
            _this.listenTo(_this, 'pre:dispose', function () {
                _this.$(window).off('resize.' + _this.cid);
            });
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({
                name: _this.name,
                title: _this.title
            }));
            _this.bindUI();

            return _this;
        },

        redraw: function (data, filter) {
            var _this = this;
            // implemented in child class
            return _this;
        },

        size: function () {
            var _this = this,
                $el = _this.$el,
                $parent = $el.parent();

            return {
                width: $parent ? $parent.innerWidth() : $el.innerWidth(),
                height: $parent ? $parent.innerHeight() : $el.innerHeight()
            };
        },

        editWidget: function () {
            var _this = this;

            if(_this.widgetBuilderView) {
                _this.widgetBuilderView.reinit({
                    widgetModel: _this.widgetModel,
                    rowModel: _this.rowModel
                });
            }
        },

        removeWidget: function () {
            var _this = this;

            var rows = _.map(_this.dashboardMetaModel.get('rows'), function(row) {
                var rowClone = _.clone(row);
                rowClone.widgets = _.filter(rowClone.widgets, function(widget) {
                    return widget.id !== _this.name;
                });
                return rowClone;
            });

            _this.dashboardMetaModel.set('rows', rows);
            if(!config.stubs) {
                _this.dashboardMetaModel.save();
            }

            _this.$el.closest('.template-cell').remove();
        },

        _resize: function (e) {
            var _this = this;
            // implemented in child class
            return _this;
        },

        _formatterFactory: function (type, format) {
            switch (type) {
                case 'date':
                    return function (d) {
                        return d3.time.format(format)(new Date(d));
                    };
                default:
                    if(format === '$') {
                        return function (d){
                            return '$' + d3.format(',.2f')(d);
                        };
                    } else {
                        return format? d3.format(format) : function(d){ return d; };
                    }
            }
        }
    });

    return View;
});