/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        EventModel = require('components/eventseq/model/event'),
        EventView = require('components/eventseq/view/event'),
        config = require('config/api'),
        EventMarshaller = require('libs/eventmarshaller'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/single'],

        elementsUI: {
            'singleevent': '.singleevent'
        },

        initialize: function (options) {
            var _this = this;

            _this.id = options.id;
            _this.dictionary = options.dictionaryModel;

            _this.$eventId = $('[name="promotions[' + _this.id + '].event.eventId"]');
            _this.$settingId = $('[name="promotions[' + _this.id + '].event.settingId"]');
            _this.$paramLow = $('[name="promotions[' + _this.id + '].event.paramLow"]');
            _this.$paramHigh = $('[name="promotions[' + _this.id + '].event.paramHigh]');
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template());

            _this.bindUI();

            return _this;
        },

        guid: function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        },

        redraw: function () {
            var _this = this;

            // TODO temp dummy
            var unparsedEvent = {
                "eventId": _this.$eventId.val() ? _this.$eventId.val() : 1,
                "settingId": _this.$settingId.val(),
                "paramLow": _this.$paramLow.val(),
                "paramHigh": _this.$paramHigh.val(),
                "include": true
            };

            _this.event = EventMarshaller.unmarshall(_this.dictionary)(unparsedEvent);
            _this.event.guid = _this.guid();

            var eventModel = new EventModel(_this.event);

            var eventView = new EventView({
                model: eventModel,
                dictionary: _this.dictionary
            });

            _this.listenTo(eventModel, 'submit', _this._submitEvent);
            _this.listenTo(eventModel, 'create', _this._submitEvent);

            _this.$el.find('.singleevent').append(eventView.el);
            eventView.render();

            _this._submitEvent(eventModel);

            return _this;
        },

        _submitEvent: function (e) {
            var _this = this;

            var event = EventMarshaller.marshall(e.toJSON());

            _this.$eventId.val(event.eventId);
            _this.$settingId.val(event.settingId);
            _this.$paramLow.val(event.paramLow);
            _this.$paramHigh.val(event.paramHigh);
        }
    });

    return View;
});