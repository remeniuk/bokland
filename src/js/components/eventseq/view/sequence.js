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
        config    = require('config/api'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        dictionaryUrl: function() {
            return config.funnelServer + (config.stubs ?
                'funnelDictionaries.json' :
                'reports/funnelDictionaries');
        },

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

            _this.events = new EventsModel([]);
            _this.listenTo(_this.events, 'sync', _this.redraw);

            _this.$el.html(_this.template({}));

            _this.bindUI();

            $.ajax({
                url: _this.dictionaryUrl(),
                success: function(dictionary){
                    _this.dictionary = dictionary;
                    _this.events.dictionary = dictionary;
                    _this.events.fetch();
                }
            });

            return _this;
        },

        redraw: function () {
            var _this = this;

            var newEventView = new EventView({
                model: _this.newEvent,
                dictionary: _this.dictionary,
                isNew: true
            });
            _this.$el.find('.sequence').append(newEventView.el);
            newEventView.render();

            _this.events.each(function(event){
                var eventView = new EventView({
                    model: event,
                    dictionary: _this.dictionary
                });
                _this.$el.find('.sequence').append(eventView.el);
                eventView.render();
            });

            return _this;
        },

        _addEvent: function() {
            var _this = this;

            var _newEvent = _this.newEvent.clone();

            _this.events.add(_newEvent);

            var eventView = new EventView({
                model: _newEvent,
                dictionary: _this.dictionary
            });
            _this.$el.find('.sequence').append(eventView.el);
            eventView.render();

            _this.newEvent.clear();

            return _this;
        }
    });

    return View;
});