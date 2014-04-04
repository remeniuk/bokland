/* global define */
define(function(require) {
    'use strict';

    // code
    var env = (location.hostname === 'localhost') || /\.local/.test(location.hostname) ? 'dev' : 'prod';

    var config = {
        'dev': {
            server: 'http://localhost:8888/api/v1/'
        },
        'prod': {
            server: 'http://example.com/api/v1/'
        }
    };

    return config[env];
});