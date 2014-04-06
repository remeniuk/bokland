/* global define */
define(function(require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        BaseView  = require('libs/view'),
        templates = require('templates/templates');


    // code
    var SETTINGS_KEY = 'opt',
        ACTIVE_CLASS = 'active';

    var __super__ = BaseView.prototype;
    var View = BaseView.extend({
        template: templates['components/dropdowns/dropdown'],

        options: {
            type: 'single',
            opts: {}
        },

        events: {
            'click @ui.item': '_select'
        },

        elementsUI: {
            'display': null,
            'item': '[data-action]'
        },


        initialize: function(options) {
            var _this = this;
            _this.options = options;

            _this.state.init('_', []);

            _this.listenTo(_this.state, 'change', _this.redraw);
        },

        render: function() {
            var _this = this,
                options = _this.options;

            _this.$el.html(_this.template(options));
            _this.bindUI();
            _this.redraw();

            return _this;
        },

        redraw: function() {
            var _this = this,
                options = _this.options;

            if (options) {
                var selects = _this.state.get('_'),
                    names = [],
                    ui = _this.ui,
                    $items = ui.$item,
                    $display = ui.$display,
                    info,
                    id,
                    i;

                if (_.isEmpty(selects) && _.isArray(options.defaults)) {
                    selects = _.clone(options.defaults);
                }

                $items.removeClass(ACTIVE_CLASS);
                for (i in selects) {
                    id = selects[i];

                    if (options.opts[id]) {
                        names.push(options.opts[id]);
                    }

                    $items.filter('[data-action="' + id + '"]').addClass(ACTIVE_CLASS);
                }

                info = names.length ? '(' + names.join(', ') + ')' : '';
                $display.text(info);

                _this.trigger('display', _this, info, names);
            }

            return _this;
        },

        select: function(action) {
            var _this = this,
                options = _this.options,
                selects = _this.state.get('_'),
                index;

            switch (action) {
                case 'reset':
                    selects = [];
                    break;
                default:
                    /* jshint eqeqeq:false */
                    if (action == Number(action)) {
                        action = Number(action);       // convert string to number ('1' to 1)
                    }
                    /* jshint eqeqeq:true */

                    index = _.indexOf(selects, action);
                    if (index === -1) {
                        if (options.type === 'multi') {
                            selects.push(action);
                        } else {
                            selects = [action];
                        }
                    } else {
                        selects.splice(index, 1);
                    }
                    break;
            }

            _this.state.set('_', selects);

            return _this;
        },

        _select: function(e) {
            var _this = this,
                action = _this.$(e.currentTarget).attr('data-action');

            _this.select(action);

            e.preventDefault();
        }
    });

    return View;
});