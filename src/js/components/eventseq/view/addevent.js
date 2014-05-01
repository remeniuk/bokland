/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/addeventialog'],

        elementsUI: {
            'heightInput': '#row-height',
            'button': 'input'
        },

        events: {
            'click @ui.button': '_addEvent'
        },

        initialize: function (options) {
            var _this = this;

        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

            return _this;
        },

        _addRow: function (ev) {
            var _this = this;

            ev.preventDefault();

            var events = _this.model.get('events');
            events.push({
            });
            _this.model.set('events', events);

            this.model.trigger('eventadded');
        }

    });

    return View;
});