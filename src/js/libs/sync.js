/* global define */
define(function(require) {
    'use strict';

    // imports
    var Backbone = require('backbone'),
        cookies  = require('helpers/cookies');


    // code
    return function(method, model, options) {
        var _this = this,
            apikey = cookies.get('API-key');

        options || (options = {});
        if (apikey) {
            options.beforeSend = function(xhr) {
                xhr.withCredentials = true;
                xhr.setRequestHeader('Authorization', 'API-key ' + apikey);
            };
        }

        return Backbone.sync.call(_this, method, model, options);
    };
});