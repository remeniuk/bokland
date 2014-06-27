/* global define */
define(function (require) {
    'use strict';

    // code
    return {
        unmarshall: function (dictionary) {
            var findById = function (dictionary, id) {
                return _.find(dictionary, function (tuple) {
                    return tuple.id == id;
                });
            };

            return function (unparsedEvent) {
                var isPositive = function (param) {
                    return param !== '' && param >= 0;
                };

                var paramType = (isPositive(unparsedEvent.paramLow) && isPositive(unparsedEvent.paramHigh) &&
                    unparsedEvent.paramLow == unparsedEvent.paramHigh) ? 'eq' :
                    (isPositive(unparsedEvent.paramLow) && isPositive(unparsedEvent.paramHigh) ? 'btw' :
                        (isPositive(unparsedEvent.paramHigh) ? 'lt' :
                            (isPositive(unparsedEvent.paramLow) ? 'gt' : undefined)));

                var eventMeta = findById(dictionary.get('events'), unparsedEvent.eventId);

                var event = {
                    'id': unparsedEvent.eventId,
                    'name': eventMeta.name
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

                    switch (eventMeta.settingType) {
                        case 'settings':
                            event.item_name = findById(dictionary.get('settings'), unparsedEvent.settingId).name;
                            break;

                        case 'apps':
                            event.item_name = findById(dictionary.get('apps'), unparsedEvent.settingId).name;
                            break;
                    }
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

            if (event.item_id) {
                marshalledEvent.settingId = parseInt(event.item_id);
            }

            return marshalledEvent;
        }
    };
});