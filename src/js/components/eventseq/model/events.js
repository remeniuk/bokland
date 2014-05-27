/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        EventModel = require('components/eventseq/model/event'),
        Backbone = require('backbone');

    // code
    var Model = Backbone.Collection.extend({
        url: function () {
            return config.funnelServer + (config.stubs ?
                'funnelEvents.json' :
                'reports/funnel/' + this.get('id') + '/events');
        },

        parse: function (response) {
            var _this = this;

            var findById = function (dictionary, id) {
                return _.find(dictionary, function (tuple) {
                    return tuple.id == id;
                }).name;
            };

            var events = _.map(response.sequence, function (eventUserCount) {
                var unparsedEvent = eventUserCount.event;

                var paramType = (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 &&
                    unparsedEvent.paramLow == unparsedEvent.paramHigh) ? 'eq' :
                    (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 ? 'btw' :
                        (unparsedEvent.paramHigh >= 0 ? 'lt' :
                            (unparsedEvent.paramLow >= 0 ? 'gt' : undefined)));

                var event = {
                    'id': unparsedEvent.eventId,
                    'name': findById(_this.dictionary.events, unparsedEvent.eventId)
                };
                if (paramType) {
                    event.parameter = {
                        'from': unparsedEvent.paramLow,
                        'to': unparsedEvent.paramHigh,
                        'type': paramType
                    }
                }
                if (unparsedEvent.settingId) {
                    event.item_id = unparsedEvent.settingId;
                    event.item_name = findById(_this.dictionary.settings, unparsedEvent.settingId);
                }
                return event;
            });

            return events;
        },

        model: EventModel
    });

    return Model;
});