/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        urlRoot: function() {
            return config.server + (config.stubs ?
                'widget.json' :
                'meta/widgets/');
        },
        defaults: {
            widgetType: 'pie',
            filterBy: '',
            rows: [],
            cols: [],
            measures: [],
            width: 6
        },

        parse: function(resp) {
            var _this = this,
                data;

            if (resp.status) {
                _this._errors = resp.errors;
                data = resp.data;
            } else {
                data = resp;
            }

            data.id = (data._id || {}).$oid;

            return data;
        }
    });

    return Model;
});