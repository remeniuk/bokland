/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        EventDialog = require('components/eventseq/view/addevent'),
        time = require('helpers/time'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/event'],
        addEventChevronTemplate: templates['components/eventseq/addeventchevron'],
        eventChevronTemplate: templates['components/eventseq/eventchevron'],
        loginEventChevronTemplate: templates['components/eventseq/logineventchevron'],
        retentionEventChevronTemplate: templates['components/eventseq/retentioneventchevron'],
        installEventChevronTemplate: templates['components/eventseq/installeventchevron'],

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
            _this.dictionary = options.dictionary;
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
                dictionary: _this.dictionary,
                addNew: _this.isNew ? true : false
            });

            _this.region('edit-event-dialog').show(_this.eventDialog);

            _this.redraw();

            return _this;
        },

        redraw: function () {
            var _this = this;

            if (!_this.isNew) {
                var event = _.clone(_this.model.toJSON());

                var eventMeta = _this._findEvent(event.id);
                var chevronTemplate = _this.eventChevronTemplate;

                switch (eventMeta.settingType) {
                    case 'settings':

                        switch (eventMeta.paramType) {
                            case 'string':
                                if (event.parameter) {
                                    event.parameter = _.clone(event.parameter);
                                    event.parameter.from = _this._parameterName(event.parameter.from, eventMeta.paramValues);
                                }
                                break;

                            case 'seconds_since_registration':
                                if (event.parameter) {
                                    event.parameter = _.clone(event.parameter);
                                    event.parameter.from = event.parameter.from / (24 * 60 * 60);
                                    event.parameter.to = event.parameter.to / (24 * 60 * 60);
                                }

                                chevronTemplate = _this.retentionEventChevronTemplate;
                                break;

                            case 'seconds_since_epoch':
                                if (event.parameter) {
                                    event.parameter = _.clone(event.parameter);
                                    event.parameter.from = time.param(new Date(event.parameter.from * 1000));
                                    event.parameter.to = time.param(new Date(event.parameter.to * 1000));
                                }

                                chevronTemplate = _this.loginEventChevronTemplate;
                                break;
                        }
                        break;

                    case 'apps':
                        chevronTemplate = _this.installEventChevronTemplate;

                        break;
                }

                _this.$el.find('[data-region="event-chevron"]').html(chevronTemplate(event));
            } else {
                _this.$el.find('[data-region="event-chevron"]')
                    .html(_this.addEventChevronTemplate());
            }
        },

        _openEditDialog: function () {
            var _this = this;

            _this.eventDialog.open();
        },

        // todo extract to library
        _findEvent: function (eventId) {
            var _this = this;

            return _.find(_this.dictionary.get('events'), function (event) {
                return event.id == eventId;
            });
        },

        _parameterName: function (paramId, mapping) {
            return _.chain(mapping).pairs().find(function (tuple) {
                return tuple[1] == paramId;
            }).value()[0];
        }
    });

    return View;
});