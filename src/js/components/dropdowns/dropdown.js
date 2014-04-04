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

        className: 'components-dropdown',

        options: {
            display: null,
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
                    $display,
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

                $display = options.display ? _this.$(options.display) : ui.$display;
                $display.text(names.length ? '(' + names.join(', ') + ')' : '');
            }

            return _this;
        },

        _select: function(e) {
            var _this = this,
                options = _this.options,
                action = _this.$(e.currentTarget).attr('data-action'),
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

            e.preventDefault();
        }
    });

    return View;
});