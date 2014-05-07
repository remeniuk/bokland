/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: config.server + 'widget.json',
        defaults: {
            widgetType: 'pie',
            filterBy: '',
            xAxis: {
                type: '',
                format: '',
                label: ''
            },
            yAxis: {
                type: '',
                format: '',
                label: ''
            },
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