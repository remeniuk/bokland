/* global define */
define(function(require) {
    'use strict';

    // imports
    var _        = require('underscore'),
        Backbone = require('backbone');


    // code
    var REF_DELIMITER = '.';


    var RefEvents = ['on', 'once', 'off'].map(function(method) {
        return function(name) {
            var _this = this,
                args = _.toArray(arguments),
                parts = name.split(':');

            if (parts[0] === 'change') {
                args[0] = 'change:' + _this.ref + (parts.length === 2 ? REF_DELIMITER + parts[1] : '');
            }

            return Backbone.Events[method].apply(_this, args);
        };
    });


    var Ref = function(options) {
        var _this = this;
        options || (options = {});
        _.extend(_this, _.pick(options, ['base', 'path']));
        _this.initialize(options);
    };

    _.extend(Ref.prototype, Backbone.Events, RefEvents, {

        disposed: false,


        initialize: function(options) {

        },

        dispose: function() {
            var _this = this,
                name;

            if (_this.disposed) {
                return _this;
            }

            _this.trigger('pre:dispose', _this);

            _this.hide();
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

        init: function(key, val, options) {
            var _this = this,
                attrs;

            if (key === null) {
                return _this;
            }

            if (typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                attrs = val;
            }

            options = _.extend({silent: true}, options || {});

            _this.set(attrs, options);

            return _this;
        },

        set: function(key, val, options) {
            var _this = this,
                attrs;

            if (key === null) {
                return _this;
            }

            if (typeof key === 'object') {
                attrs = key;
                options = val;
                key = _this.path;
            } else {
                attrs = val;
                key = _this.path + REF_DELIMITER + key;
            }

            _this.base.set(key, attrs, options);

            return _this;
        },

        get: function(name) {
            var _this = this;
            return _this.base.get(_this.path + REF_DELIMITER + name);
        },

        toJSON: function() {
            var _this = this;
            return _this.base.get(_this.path);
        },

        ref: function(name) {
            var _this = this;
            return _this.base.ref(_this.path + REF_DELIMITER + name);
        }

    });


    return Ref;
});