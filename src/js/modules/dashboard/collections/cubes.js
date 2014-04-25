/* global define */
define(function(require) {
    'use strict';

    // imports
    var _              = require('underscore'),
        config         = require('config/api'),
        BaseCollection = require('libs/collection'),
        CubeModel      = require('../models/cube');


    // code
    var __super__ = BaseCollection.prototype;
    var Collection = BaseCollection.extend({
        model: CubeModel,
        url: config.server + 'cubes.json',
        parametric: true,

        parse: function(response) {
            var _this = this;
            return response.data;
        }
    });

    return Collection;
});