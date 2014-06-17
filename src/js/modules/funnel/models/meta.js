/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: function () {
            return config.server + (config.stubs ?
                'funnelMeta.json' :
                'meta/funnels');
        },

        parse: function (response) {
            var _this = this;

            var findById = function (dictionary, id) {
                return _.find(dictionary, function (tuple) {
                    return tuple.id == id;
                }).name;
            };

            response.data.sequence = _.map(response.data.sequence, function (eventUserCount) {
                var unparsedEvent = eventUserCount.event;

                var paramType = (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 &&
                    unparsedEvent.paramLow == unparsedEvent.paramHigh) ? 'eq' :
                    (unparsedEvent.paramLow >= 0 && unparsedEvent.paramHigh >= 0 ? 'btw' :
                        (unparsedEvent.paramHigh >= 0 ? 'lt' :
                            (unparsedEvent.paramLow >= 0 ? 'gt' : undefined)));

                var event = {
                    'id': unparsedEvent.eventId,
                    'name': findById(_this.dictionary.get('events'), unparsedEvent.eventId)
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
                    event.item_name = findById(_this.dictionary.get('settings'), unparsedEvent.settingId);
                }
                return event;
            });

            return response;
        },

        save: function(key, val, options) {
            var _this = this;
            var funnelModel = this.toJSON().data;

            funnelModel.sequence = _.map(funnelModel.sequence, function(event){
                return {
                    eventId: event.id,
                    settingId: event.item_id,
                    paramLow: event.parameter ? event.parameter.from : event.parameter,
                    paramHigh: event.parameter ? event.parameter.to : event.parameter,
                    include: true
                };
            });

            var ServerModel = Backbone.Model.extend({
                url: _this.url
            });

            new ServerModel(funnelModel).save();
        }
    });

    return Model;
});