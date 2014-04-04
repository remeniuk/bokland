/* global define */
define(function(require) {
    'use strict';

    // imports
    var _              = require('underscore'),
        config         = require('config/api'),
        BaseCollection = require('libs/collection'),
        SeriesModel    = require('../models/series');


    // code
    var __super__ = BaseCollection.prototype;
    var Collection = BaseCollection.extend({
        model: SeriesModel,
        url: config.server + 'stats-series.json',
        parametric: true,

        parse: function(response) {
            var _this = this;
            return response.data;
        }
    });

    return Collection;
});