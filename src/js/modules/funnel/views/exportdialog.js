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
        template: templates['modules/funnel/exportdialog'],

        elementsUI: {
            'button': '.btn',
            'maxRecords': '#max-records',
            'startFrom': '#start-from'
        },

        events: {
            'click @ui.button': '_export'
        },

        initialize: function (options) {
            var _this = this;

            _this.dictionaryModel = options.dictionaryModel;
            _this.funnelMetaModel = options.funnelMetaModel;
            _this.funnelDataModel = options.funnelDataModel;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

            return _this;
        },

        _export: function (ev) {
            var _this = this;

            var size = _this.ui.$maxRecords.val();
            var offset = _this.ui.$startFrom.val();
            var entries = _this.funnelDataModel.get('entries').slice(offset, size + offset);

            if(entries.length >= offset) {
                var csvContent = "data:text/csv;charset=utf-8," +
                    _.keys(entries[0]).join(",") + "\n";

                _.each(entries, function (infoArray) {
                    csvContent += _.values(infoArray).join(",") + "\n";
                });

                var encodedUri = encodeURI(csvContent);
                window.open(encodedUri);
            }

            ev.preventDefault();
        }

    });

    return View;
});