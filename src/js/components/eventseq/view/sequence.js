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
        config    = require('config/api'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/sequence'],

        elementsUI: {
            'sequence': '.sequence'
        },

        initialize: function (options) {
            var _this = this;

            _this.dictionary = options.dictionaryModel;
            _this.funnelMetaModel = options.funnelMetaModel;

            _this.newEvent = new EventModel({});

            _this.listenTo(_this.newEvent, 'create', _this._addEvent);
            _this.listenTo(_this.funnelMetaModel, 'sync', _this.redraw);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

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

            _.each(_this.funnelMetaModel.get('data').sequence, function(event){
                var eventView = new EventView({
                    model: new EventModel(event),
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

            _this.funnelMetaModel.get('data').sequence.push(_newEvent.toJSON());

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