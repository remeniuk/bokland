/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
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
        },

        render: function () {
            var _this = this;

            // TODO: load sequence of events from server

            _this.events = new EventsModel([{
                'id': '1',
                'name': 'Event #1',
                'item_id': '1',
                'parameter': {
                    'type': 'gt',
                    'from': 1
                }
            },{
                'id': '2',
                'name': 'Event #2',
                'item_id': '1',
                'parameter': {
                    'type': 'lt',
                    'to': 2
                }
            },{
                'id': '3',
                'name': 'Event #3',
                'parameter': {
                    'type': 'btw',
                    'from': 1,
                    'to': 2
                }
            },{
                'id': '4',
                'name': 'Event #4',
                'parameter': {
                    'type': 'eq',
                    'value': 1
                }
            },{
                'id': '5',
                'name': 'Event #5'
            }]);

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

            return _this;
        }
    });

    return View;
});