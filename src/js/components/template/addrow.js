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
            'button': 'input.btn'
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
            var _this = this,
                height = _this.ui.$heightInput.val();

            ev.preventDefault();

            _this.$el.find('.form-group').removeClass('has-error');
            if(!height.match(/\d{3}/i)){
                _this.ui.$heightInput.closest('.form-group').addClass('has-error');
                return false;
            }

            var rows = _this.model.get('rows');
            rows.push({
               height: height
            });
            _this.model.set('rows', rows);

            this.model.trigger('rowadded');
        }

    });

    return View;
});