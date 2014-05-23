/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        EventModel = require('components/eventseq/model/event'),
        EventsModel = require('components/eventseq/model/events'),
        EventView = require('components/eventseq/view/event'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/sequence'],

        elementsUI: {
            'sequence': '.sequence'
        },

        initialize: function (options) {
            var _this = this;

            _this.newEvent = new EventModel({});
            _this.listenTo(_this.newEvent, 'create', _this._addEvent);
        },

        render: function () {
            var _this = this;

            // TODO: load sequence of events from server

            _this.events = new EventsModel([]);

            _this.$el.html(_this.template({}));

            _this.bindUI();

            _this.redraw();

            return _this;
        },

        redraw: function () {
            var _this = this;

            _this.events.each(function(event){
                var eventView = new EventView({
                    model: event
                });
                _this.$el.find('.sequence').append(eventView.el);
                eventView.render();
            });

            var newEventView = new EventView({
                model: _this.newEvent,
                isNew: true
            });
            _this.$el.find('.sequence').append(newEventView.el);
            newEventView.render();

            return _this;
        },

        _addEvent: function() {
            var _this = this;

            var _newEvent = _this.newEvent.clone();

            _this.events.add(_newEvent);

            var eventView = new EventView({
                model: _newEvent
            });
            _this.$el.find('.sequence').append(eventView.el);
            eventView.render();

            _this.newEvent.clear();

            return _this;
        }
    });

    return View;
});