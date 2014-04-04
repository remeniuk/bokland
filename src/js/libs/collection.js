/* global define */
define(function(require) {
    'use strict';

    // imports
    var _          = require('underscore'),
        Backbone   = require('backbone'),
        BaseModel  = require('./model'),
        StateModel = require('./state'),
        sync       = require('./sync');


    // code
    var __super__ = Backbone.Collection.prototype;
    var Collection = Backbone.Collection.extend({
        model: BaseModel,

        parametric: false,

        initialize: function(models, options) {
            var _this = this;

            options || (options = {});
            if (_this.parametric) {
                _this.params = options.params || new StateModel();
                _this.defaults = options.defaults || {};

                _this.listenTo(_this.params, 'change', function() {
                    _this.fetch();
                });
            }
        },

        fetch: function(options) {
            var _this = this;

            if (_this.parametric) {
                options = options ? _.clone(options) : {};
                options.reset = true;
                options.data = _.defaults(_this.params.serialize(), _this.defaults);
            }

            return __super__.fetch.call(_this, options);
        },

        sync: function() {
            var _this = this;
            return sync.apply(_this, arguments);
        },

        parse: function(response) {
            var _this = this;
            _this._metadata = response._metadata;
            return response.data;
        },

        metadata: function() {
            var _this = this;
            return _this._metadata;
        }
    });

    return Collection;
});