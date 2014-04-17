/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                 = require('jquery'),
        _                 = require('underscore'),
        BaseView          = require('libs/view'),
        DropdownComponent = require('components/dropdowns/dropdown'),
        templates         = require('templates/templates');


    // code
    var __super__ = BaseView.prototype;
    var View = BaseView.extend({
        template: templates['components/widget-stats/chart'],

        className: 'component-widget',

        options: {
            name: null,
            title: '',
            settings: null
        },

        elementsUI: {
            'display': null
        },

        initialize: function(options) {
            var _this = this;

            _this.options = options;
            _this.name = options.name;

            _this._data = null;

            _this.state.init({
                _: [],
                opt: {}
            });

            _this.$el.html(_this.template({
                name: options.name,
                title: options.title,
                settings: options.settings
            }));
            _this.bindUI();

            if (options.settings) {
                var settings = new DropdownComponent(_.extend({}, options.settings, {
                    state: _this.state.ref('opt')
                }));

                _this.listenTo(settings, 'display', function(view, info) {
                    _this.ui.$display.text(info);
                });

                _this.region('settings').show(settings);
            }


            _this.listenTo(_this.collection, 'sync', function() {
                var collection = _this.collection,
                    data = collection.get(_this.name),
                    filter = _this.state.get('_');

                if (data) {
                    _this._data = data.get('data');
                    _this.redraw(data.get('data'), filter);
                }
            });

            _this.listenTo(_this.state, 'change', function() {
                if (_this._data) {
                    var filter = _this.state.get('_');
                    _this.redraw(_this._data, filter);
                }
            });

            $(window).on('resize.' + _this.cid, _.throttle(_this._resize.bind(_this), 100));
            _this.listenTo(_this, 'pre:dispose', function() {
                _this.$(window).off('resize.' + _this.cid);
            });
        },

        redraw: function(data, filter) {
            var _this = this;
            // implemented in child class
            return _this;
        },

        size: function() {
            var _this = this,
                $el = _this.$el,
                $parent = $el.parent();

            return {
                width: $parent ? $parent.innerWidth() : $el.innerWidth(),
                height: $parent ? $parent.innerHeight() : $el.innerHeight()
            };
        },

        _resize: function(e) {
            var _this = this;
            // implemented in child class
            return _this;
        }
    });

    return View;
});