/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        transition = require('helpers/transition'),
        BaseView = require('libs/view'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['components/loader/loader'],

        elementsUI: {
            'overlay': null,
            'loader': '.loader'
        },

        initialize: function (options) {
            var _this = this;

            _this.counter = 0;

            $(document)
                .ajaxSend(function () {
                    _this.redraw('in');
                })
                .ajaxComplete(function () {
                    _this.redraw('out');
                });

            _this.listenTo(_this, 'pre:unbind-ui', function () {
                _this.ui.$overlay.off(transition.end);
            });

            if (options.root) {
                $(options.root).append(_this.$el);
            }
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            _this.ui.$overlay
                .addClass('out')
                .on(transition.end, _this._animate.bind(_this));

            return _this;
        },

        redraw: function (action) {
            var _this = this,
                $overlay = _this.ui.$overlay,
                $loader = _this.ui.$loader;

            switch (action) {
                case 'in':
                    if (_this.counter === 0) {
                        $overlay.removeClass('out');
                        _.delay(function () {
                            if (_this.counter) {
                                $overlay.addClass('in');
                            } else {
                                $overlay.addClass('out');
                            }
                        }, 50);
                    }
                    _this.counter++;
                    break;
                case 'out':
                    _this.counter--;
                    if (_this.counter === 0) {
                        $overlay.removeClass('in').addClass('out');
                        $loader.addClass('out');
                    }
                    break;
                default:
                    break;
            }

            return _this;
        },

        _animate: function () {
            var _this = this,
                $overlay = _this.ui.$overlay;

            if (!$overlay.hasClass('in')) {
                $overlay.addClass('out');
            }

            return _this;
        }
    });

    return View;
});