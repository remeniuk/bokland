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
                'meta/funnels/' + this.get('id'));
        },

        parse: function (response) {
            var _this = this;

            var findById = function (dictionary, id) {
                return _.find(dictionary, function (tuple) {
                    return tuple.id == id;
                }).name;
            };

            response.data.sequence = _.map(response.data.sequence, function (unparsedEvent) {
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
            var funnelModel = _.clone(this.toJSON().data);

            funnelModel.sequence = _.map(funnelModel.sequence, function(event){
                var marshalledEvent = {
                    eventId: parseInt(event.id),
                    include: true
                };

                if(event.parameter && event.parameter.from) {
                  marshalledEvent.paramLow = parseInt(event.parameter.from);
                }

                if(event.parameter && event.parameter.to) {
                  marshalledEvent.paramHigh = parseInt(event.parameter.to);
                }

                return marshalledEvent;
            });

            var ServerModel = Backbone.Model.extend({
                url: _this.url
            });

            var serverModel = new ServerModel(funnelModel)
            _this.listenTo(serverModel, 'sync', function () {
              _this.trigger('updated');
            });

            serverModel.save();
        }
    });

    return Model;
});