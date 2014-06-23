/* global define */
define(function(require) {
    'use strict';

    // imports
    var _          = require('underscore'),
        BaseRouter = require('libs/router');


    // code
    var Router = BaseRouter.extend({
        routes: {
            '(:id/)~*params': 'funnel'
        }
    });

    return Router;
});