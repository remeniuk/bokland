/* global define */
define(function(require) {
    'use strict';

    // code
    var env = (location.hostname === 'localhost') || /\.local/.test(location.hostname) ? 'dev-stub' : 'prod';

    var config = {
        'dev-stub': {
            stubs: true,
            server: 'http://localhost:8888/api/v1/',
            funnelServer: 'http://localhost:8888/api/v1/'
        },
        'dev-server': {
            stubs: false,
            server: 'http://localhost:45000/api/v1/',
            funnelServer: 'http://localhost:45000/'
        },
        'prod': {
            stubs: false,
            server: 'http://example.com/api/v1/',
            funnelServer: 'http://example.com'
        }
    };

    return config[env];
});