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
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template(_this));

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
                "eventId": 0,
                "settingId": 1,
                "paramLow":  1402559016,
                "paramHigh": 1402559016,
                "include": true
            };

            _this.event = EventMarshaller.unmarshall(_this.dictionary)(unparsedEvent);

            event.guid = _this.guid();
            var eventModel = new EventModel(_this.event);

            var eventView = new EventView({
                model: eventModel,
                dictionary: _this.dictionary
            });

            _this.listenTo(eventModel, 'submit', _this._submitEvent);
            _this.listenTo(eventModel, 'create', _this._submitEvent);

            _this.$el.find('.singleevent').append(eventView.el);
            eventView.render();

            _this._submitEvent(_this.event);

            return _this;
        },

        _submitEvent: function (e) {
            var _this = this;

            var event = EventMarshaller.marshall(e);

            _this.$el.find('#promotions_' + _this.id + '_eventId').val(event.eventId);
            _this.$el.find('#promotions_' + _this.id + '_settingId').val(event.settingId);
            _this.$el.find('#promotions_' + _this.id + '_paramLow').val(event.paramLow);
            _this.$el.find('#promotions_' + _this.id + '_paramHigh').val(event.paramHigh);
        }
    });

    return View;
});