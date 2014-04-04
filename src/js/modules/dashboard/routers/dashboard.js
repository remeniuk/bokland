/* global define */
define(function(require) {
    'use strict';

    // imports
    var _          = require('underscore'),
        BaseRouter = require('libs/router');


    // code
    var Router = BaseRouter.extend({
        routes: {
            '~*params': 'dashboard'
        }
    });

    return Router;
});