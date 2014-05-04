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
            rows: [],
            cols: [],
            measures: [],
            width: 6
        }
    });

    return Model;
});