/* global define */
define(function (require) {
    'use strict';

    // code
    return {
        unmarshall: function(dictionary) {
            var findById = function (dictionary, id) {
                return _.find(dictionary, function (tuple) {
                    return tuple.id == id;
                }).name;
            };

            return function (unparsedEvent) {
                var paramType = (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 &&
                    unparsedEvent.paramLow == unparsedEvent.paramHigh) ? 'eq' :
                    (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 ? 'btw' :
                        (unparsedEvent.paramHigh >= 0 ? 'lt' :
                            (unparsedEvent.paramLow >= 0 ? 'gt' : undefined)));

                var event = {
                    'id': unparsedEvent.eventId,
                    'name': findById(dictionary.get('events'), unparsedEvent.eventId)
                };
                if (paramType) {
                    event.parameter = {
                        'from': unparsedEvent.paramLow,
                        'to': unparsedEvent.paramHigh,
                        'params': unparsedEvent.params,
                        'type': paramType
                    }
                }
                if (unparsedEvent.settingId) {
                    event.item_id = unparsedEvent.settingId;
                    event.item_name = findById(dictionary.get('settings'), unparsedEvent.settingId);
                }
                return event;
            };
        },

        marshall: function (event) {
            var marshalledEvent = {
                eventId: parseInt(event.id),
                include: true
            };

            if (event.parameter && event.parameter.from) {
                marshalledEvent.paramLow = parseInt(event.parameter.from);
            }

            if (event.parameter && event.parameter.to) {
                marshalledEvent.paramHigh = parseInt(event.parameter.to);
            }

            return marshalledEvent;
        }
    };
});