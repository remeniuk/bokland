/* global define */
define(function (require) {
    'use strict';

    // imports
    var $         = require('jquery'),
        _         = require('underscore'),
        config    = require('config/api'),
        bootstrap = require('bootstrap'),
        BaseView  = require('libs/view'),
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

        reinit: function (options) {
            var _this = this;
            _this.rowNum = options.rowNum;
            _this.rowModel = options.rowModel;
            _this.render();
        },

        render: function () {
            var _this = this,
                type = _this.rowModel ? 'Save' : 'Add',
                height = _this.rowModel ? _this.rowModel.get('height') : 200;

            _this.$el.html(_this.template({type: type, height: height}));

            _this.bindUI();

            return _this;
        },

        _addRow: function (ev) {
            var _this = this,
                height = _this.ui.$heightInput.val();

            ev.preventDefault();

            _this.$el.find('.form-group').removeClass('has-error');
            if (!height.match(/\d{3}/i)) {
                _this.ui.$heightInput.closest('.form-group').addClass('has-error');
                return false;
            }

            if (_this.rowModel) {
                _this.rowModel.set({height: height});
                _this.model.get('rows')[_this.rowNum] = _this.rowModel.toJSON();
                _this.rowModel.trigger('rowUpdated');
            } else {
                var rows = _this.model.get('rows');
                rows.push({height: height, widgets: []});
                _this.model.set('rows', rows);

                this.model.trigger('rowadded');
            }
        }

    });

    return View;
});