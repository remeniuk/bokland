/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        url: function() {
            return (config.stubs ?
                config.server + 'filter-criteria.json' :
                'api/v1/filter-criteria.json');
        }
    });

    return Model;
});