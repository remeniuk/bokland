/* global define */
define(function(require) {
    'use strict';

    // imports
    var _        = require('underscore'),
        Backbone = require('backbone'),
        url      = require('helpers/url');


    // code
    var NAMED_PARAM = /(\(\?)?:\w+/g,
        SPLAT_PARAM = /\*\w+/g;

    var __super__ = Backbone.Router.prototype;
    var Router = Backbone.Router.extend({
        _bindRoutes: function() {
            var _this = this,
                route,
                name;

            if (!_this.routes) {
                return;
            }
            _this.routes = _.result(_this, 'routes');
            _this.params = {};
            for (route in _this.routes) {
                name = _this.routes[route];
                _this.params[name] = _this._extractNamedParameters(route);
            }

            return __super__._bindRoutes.apply(_this, arguments);
        },

        route: function(route, name, callback) {
            var _this = this;

            if (!_.isRegExp(route)) {
                route = _this._routeToRegExp(route);
            }
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) {
                callback = _this[name];
            }

            var router = _this;
            Backbone.history.route(route, function(fragment) {
                var args = router._extractParameters(route, fragment),
                    params = _this.params[name],
                    obj;

                if (params) {
                    args = _.object(params, args);

                    if (params[params.length - 1] === 'params') {
                        obj = url.deparam(args.params);
                        delete args.params;
                        args = _this.parse(_.extend(args, obj));
                    }

                    callback && callback.call(router, args);
                    router.trigger.call(router, 'route:' + name, args);
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                }
            });

            return _this;
        },

        _extractNamedParameters: function(route) {
            var types = [NAMED_PARAM, SPLAT_PARAM],
                names = [],
                list,
                i;

            for (i in types) {
                list = route.match(types[i]);
                if (list) {
                    names = names.concat(list);
                }
            }

            return _.map(names, function(name) {
                return name.slice(1);
            });
        },

        parse: function(args) {
            return args;
        }
    });

    return Router;
});