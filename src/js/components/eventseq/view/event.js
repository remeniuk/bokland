/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        EventDialog = require('components/eventseq/view/addevent'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/event'],
        eventChevronTemplate: templates['components/eventseq/eventchevron'],

        tagName: 'li',

        elementsUI: {
            'eventLink': 'a'
        },

        events: {
            'click @ui.eventLink': '_openEditDialog'
        },

        initialize: function (options) {
            var _this = this;
            _this.model = options.model;

            _this.listenTo(_this.model, 'submit', _this.redraw);
            _this.listenTo(_this.model, 'remove', function () {
                setTimeout(function () {
                    _this.remove();
                }, 300);
            });
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template());

            _this.bindUI();

            _this.eventDialog = new EventDialog({
                model: _this.model
            });

            _this.region('edit-event-dialog').show(_this.eventDialog);

            _this.redraw();

            return _this;
        },

        redraw: function () {
            var _this = this;

            _this.$el.find('[data-region="event-chevron"]')
                .html(_this.eventChevronTemplate(_this.model.toJSON()));
        },

        _openEditDialog: function () {
            var _this = this;

            _this.eventDialog.open();
        }
    });

    return View;
});