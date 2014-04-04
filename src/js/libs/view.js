/* global define */
define(function(require) {
    'use strict';

    // imports
    var _          = require('underscore'),
        Backbone   = require('backbone'),
        StateModel = require('./state'),
        Region     = require('./region');


    // code
    var DELEGATE_EVENT_UI_SELECTOR = /^(\S+)\s*@ui\.(\S+)\s*$/;

    var __super__ = Backbone.View.prototype;
    var View = Backbone.View.extend({
        elementsUI: {},

        disposed: false,


        constructor: function(options) {
            var _this = this;

            options || (options = {});

            if (_this.options) {
                options = _.defaults({}, options, _.result(_this, 'options'));
            }

            _this.state = options.state || (new StateModel());

            _this.prepareUI();

            __super__.constructor.call(_this, options);
        },

        dispose: function() {
            var _this = this,
                regions = _this.regions || {},
                name;

            if (_this.disposed) {
                return _this;
            }

            _this.trigger('pre:dispose', _this);

            for (name in regions) {
                regions[name].dispose();
            }

            // TODO: implement state dispose
            // _this.state.dispose();

            _this.unbindUI()
                .remove();

            for (name in _this) {
                if (_.has(_this, name)) {
                    delete _this[name];
                }
            }

            _this.disposed = true;
            _this.trigger('post:dispose', _this);

            if (Object.freeze) {
                Object.freeze(_this);
            }

            return _this;
        },

        prepareUI: function() {
            var _this = this,
                events = _.result(_this, 'events'),
                elementsUI = _.result(_this, 'elementsUI'),
                preparedEvents = {},
                selector,
                hash;

            for (var name in elementsUI) {
                selector = elementsUI[name] || '[data-ui="' + name + '"]';
                elementsUI[name] = selector;
            }

            var replacer = function(key, eventName, elementName) {
                var selector = elementsUI[elementName];
                return selector ? eventName + ' ' + selector : key;
            };
            for (var key in events) {
                hash = key.replace(DELEGATE_EVENT_UI_SELECTOR, replacer);
                preparedEvents[hash] = events[key];
            }

            _this.elementsUI = elementsUI;
            _this.events = preparedEvents;

            return _this;
        },

        bindUI: function() {
            var _this = this,
                elementsUI = _this.elementsUI,
                selector;

            _this.ui = {};
            for (var name in elementsUI) {
                selector = elementsUI[name];
                _this.ui['$' + name] = _this.$(selector);
            }

            return _this;
        },

        unbindUI: function() {
            var _this = this;

            _this.trigger('pre:unbind-ui', _this);
            _this.ui = {};
            _this.trigger('post:unbind-ui', _this);

            return _this;
        },

        region: function(name, element) {
            var _this = this,
                regions = (_this.regions || (_this.regions = {}));

            if (!regions[name]) {
                regions[name] = new Region({
                    el: element,
                    name: name,
                    base: _this.el
                });
            }

            return regions[name];
        }
    });

    return View;
});