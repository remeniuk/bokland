/* global define */
define(function(require) {
    'use strict';

    // imports
    var _        = require('underscore'),
        Backbone = require('backbone'),
        sync     = require('./sync');


    // code
    var __super__ = Backbone.Model.prototype;
    var Model = Backbone.Model.extend({
        defaults: {

        },

        // idAttribute: '_id',

        save: function(key, val, options) {
            var model = this,
                attrs;

            if (key === null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.clone(options || {});

            var error = options.error;
            options.error = function(model, resp, options) {
                if (resp.status === 400) {
                    var json = resp.responseJSON || JSON.parse(resp.responseText),
                        serverAttrs = model.parse(json, options);

                    if (options.wait) {
                        serverAttrs = _.extend(attrs || {}, serverAttrs);
                    }
                    if (_.isObject(serverAttrs)) {
                        model.set(serverAttrs, options);
                    }
                }

                if (error) {
                    error(model, resp, options);
                }
            };

            return __super__.save.call(model, attrs, options);
        },

        sync: function() {
            var _this = this;
            return sync.apply(_this, arguments);
        },

        errors: function() {
            var _this = this;
            return _this._errors || {};
        },

        parse: function(resp) {
            var _this = this;

            if (resp.status) {
                _this._errors = resp.errors;
                return resp.data;
            }

            return resp;
        }
    });

    return Model;
});