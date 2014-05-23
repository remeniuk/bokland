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
        addEventChevronTemplate: templates['components/eventseq/addeventchevron'],
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
            _this.isNew = options.isNew;

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
                model: _this.model,
                addNew: _this.isNew? true : false
            });

            _this.region('edit-event-dialog').show(_this.eventDialog);

            _this.redraw();

            return _this;
        },

        redraw: function () {
            var _this = this;

            if(!_this.isNew) {
                _this.$el.find('[data-region="event-chevron"]')
                    .html(_this.eventChevronTemplate(_this.model.toJSON()));
            } else {
                _this.$el.find('[data-region="event-chevron"]')
                    .html(_this.addEventChevronTemplate());
            }
        },

        _openEditDialog: function () {
            var _this = this;

            _this.eventDialog.open();
        }
    });

    return View;
});