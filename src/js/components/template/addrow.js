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
        template: templates['components/template/addrowdialog'],

        elementsUI: {
            'heightInput': '#row-height',
            'button': 'input'
        },

        events: {
            'click @ui.button': '_addRow'
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

            var rows = _this.model.get('rows');
            rows.push({
               height: _this.ui.$heightInput.val()
            });
            _this.model.set('rows', rows);

            this.model.trigger('rowadded');
        }

    });

    return View;
});