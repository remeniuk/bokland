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
        template: templates['modules/funnel/segmentdialog'],

        elementsUI: {
            'button': 'input'
        },

        events: {
            'click @ui.button': '_createSegment'
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

        _createSegment: function (ev) {
            var _this = this;

            ev.preventDefault();
        }

    });

    return View;
});