/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model'),
        EventMarshaller = require('libs/eventmarshaller');


    // code
    var Model = BaseModel.extend({
        url: function () {
            return config.server + (config.stubs ?
                'funnelMeta.json' :
                'meta/funnels/' + this.get('id'));
        },

        parse: function (response) {
            var _this = this;

            response.data.sequence = _.map(response.data.sequence, EventMarshaller.unmarshall(_this.dictionary));

            return response;
        },

        save: function (key, val, options) {
            var _this = this;
            var funnelModel = _.clone(this.toJSON().data);

            if (funnelModel.cohort == '-1') {
                delete funnelModel.cohort;
            }

            funnelModel.sequence = _.map(funnelModel.sequence, EventMarshaller.marshall);

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