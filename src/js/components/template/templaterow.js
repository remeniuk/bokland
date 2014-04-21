/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        TemplateCell = require('components/template/templatecell'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/template/row'],

        elementsUI: {
            'addWidget': '[data-action="add-widget"]',
            'removeRow': '[data-action="remove-row"]'
        },

        events: {
            'click @ui.addWidget': '_addWidget',
            'click @ui.removeRow': '_removeRow'
        },

        initialize: function (options) {
            var _this = this;

            _this.rowNum = options.rowNum;
            _this.metaModel = options.metaModel;
            _this.collection = options.collection;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

            var rowMetaModel = _this.metaModel.get('rows')[_this.rowNum];

            _.each(rowMetaModel.widgets, function (widgetMeta) {
                var cellElement = new TemplateCell({
                    widget: widgetMeta,
                    height: rowMetaModel.height,
                    collection: _this.collection
                });

                _this.$el.children('.row').append(cellElement.$el);

                cellElement.render();
            });

            return _this;
        },

        _addWidget: function () {
            var _this = this;
            console.log('Add widget');
        },

        _removeRow: function () {
            var _this = this;

            console.log('Remove row');

            var rowMetaModel = _this.metaModel.get('rows');
            rowMetaModel.splice(_this.rowNum, 1);
            _this.metaModel.set('rows', rowMetaModel);

            this.remove();
        }
    });

    return View;
});