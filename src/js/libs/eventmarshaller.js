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
                var isPositive = function(param){
                    return param !== '' && param >= 0;
                };

                var paramType = (isPositive(unparsedEvent.paramLow) && isPositive(unparsedEvent.paramHigh) &&
                    unparsedEvent.paramLow == unparsedEvent.paramHigh) ? 'eq' :
                    (isPositive(unparsedEvent.paramLow) && isPositive(unparsedEvent.paramHigh) ? 'btw' :
                        (isPositive(unparsedEvent.paramHigh) ? 'lt' :
                            (isPositive(unparsedEvent.paramLow) ? 'gt' : undefined)));

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