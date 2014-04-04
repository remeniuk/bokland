/* global define */
define(function(require) {
    'use strict';

    // imports
    var $        = require('jquery'),
        _        = require('underscore'),
        Backbone = require('backbone');


    // code
    var Region = function(options) {
        var _this = this;
        options || (options = {});
        _.extend(_this, _.pick(options, ['name', 'base', 'el']));
        _this._ensureElement();
        _this.initialize(options);
    };

    _.extend(Region.prototype, Backbone.Events, {

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

        _ensureElement: function() {
            var _this = this,
                $base = $(_.result(_this, 'base') || 'html'),
                name = _.result(_this, 'name'),
                element;

            if (name && !_this.$el) {
                element = _this.el || $base.find('[data-region="' + name + '"]');
                _this.$el = element instanceof $ ? element : $(element);
                _this.el = _this.$el[0];
            }

            return _this;
        },

        show: function(view, options) {
            var _this = this,
                $el = _this.$el,
                redrawAction;

            if ($el) {
                options || (options = {});
                _this.trigger('pre:show', _this, view, options);

                if (view instanceof Backbone.View) {
                    if (_this.view && _this.view.cid === view.cid) {
                        redrawAction = _.isFunction(_this.view.redraw) ? 'redraw' : 'render';
                        _this.view[redrawAction]();
                    } else {
                        _this.hide(options);
                        $el.append(view.$el);
                        view.render();
                        _this.view = view;
                    }
                }

                _this.trigger('post:show', _this, view, options);
            }

            return _this;
        },

        hide: function(options) {
            var _this = this,
                $el = _this.$el,
                view = _this.view;

            if ($el && view) {
                options || (options = {});
                _this.trigger('pre:hide', _this, options);

                if (options.destroy !== false && _.isFunction(view.dispose)) {
                    view.dispose();
                    _this.view = null;
                }
                _this.$el.empty();

                _this.trigger('post:hide', _this, options);
            }

            return _this;
        }

    });


    return Region;
});