/* global define */
define(function(require) {
    'use strict';

    // imports
    var _              = require('underscore'),
        config         = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var __super__ = BaseModel.prototype;
    var Data = BaseModel.extend({
        url: function() {
            return config.server + (config.stubs ?
                'funnelData.json' :
                '');
        }
    });

    return Data;
});