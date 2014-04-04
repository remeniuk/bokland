/* global define */
define(function(require) {
    'use strict';

    // imports
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        NestedModel = require('nestedmodel'),
        RefModel    = require('./ref'),
        time        = require('helpers/time');


    // code
    var REF_DELIMITER = '.';


    var traversable = function(obj, iterator, context) {
        var map = function(obj) {
            if (_.isString(obj) || _.isNumber(obj) || _.isBoolean(obj) || _.isDate(obj) || _.isRegExp(obj) || _.isFunction(obj)) {
                return iterator.call(context, obj);
            }

            if (_.isArray(obj)) {
                for (var i = 0, length = obj.length; i < length; i++) {
                    obj[i] = map(obj[i]);
                }
                return obj;
            }

            if (_.isObject(obj)) {
                for (var key in obj) {
                    if (_.has(obj, key)) {
                        if (obj[key] !== null) {
                            obj[key] = map(obj[key]);
                        } else {
                            delete obj[key];
                        }
                    }
                }
                return obj;
            }

            return iterator.call(context, obj);
        };

        return map($.extend(true, {}, obj));
    };

    var __super__ = Backbone.NestedModel.prototype;
    var StateModel = Backbone.NestedModel.extend({
        initialize: function() {
            var _this = this;
            _this._refs = {};
            __super__.initialize.apply(_this, arguments);
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

        fill: function(attrs, options) {
            var _this = this,
                data = {},
                unset = {},
                keys = _.union(_.keys(attrs), _.keys(_this.attributes)),
                key,
                i;

            for (i in keys) {
                key = keys[i];
                if (key in attrs) {
                    data[key] = attrs[key];
                } else {
                    data[key] = void 0;
                    unset[key] = void 0;
                }
            }

            _this.set(data, options);
            _this.set(unset, {unset: true, silent: true});

            return _this;
        },

        ref: function(name) {
            var _this = this,
                path = name.split(REF_DELIMITER),
                ref;

            if (!_this._refs[name]) {
                ref = new RefModel({
                    base: _this,
                    path: name
                });

                _this.listenTo(_this, 'change:' + path[0], function() {
                    ref.trigger('change');
                });

                _this._refs[name] = ref;
            }

            return _this._refs[name];
        },

        serialize: function() {
            var _this = this;
            return traversable(__super__.toJSON.call(_this), function(obj) {
                if (_.isDate(obj)) {
                    return time.param(obj);
                }
                return obj;
            });
        },

        parse: function(data) {
            var _this = this;
            data = $.extend(true, {}, data);
            return traversable(data, function(obj) {
                return time.deparam(obj + '') || obj;
            });
        }
    });

    return StateModel;
});