/* global require, define */
(function() {
    'use strict';


    var dirs = {
        bower: '/base/bower_components/'
    };

    var tests = [];
    for (var file in window.__karma__.files) {
        if (/-spec\.js$/.test(file)) {
            // save test path
            tests.push(file);
        }
    }


    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: '/base/src/js/',

        // shim
        shim: {
            underscore: {
                exports: '_'
            },
            backbone: {
                deps: [
                    'underscore',
                    'jquery'
                ],
                exports: 'Backbone'
            },
            nestedmodel: ['backbone'],
            d3: {
                exports: 'd3'
            },
            nvd3: {
                deps: [
                    'd3'
                ],
                exports: 'nv'
            },
            topojson: {
                exports: 'topojson'
            },
            deparam: ['jquery']
        },
        paths: {
            jquery: dirs.bower + 'jquery/dist/jquery',
            underscore: dirs.bower + 'underscore/underscore',
            // underscore: dirs.bower + 'lodash/dist/lodash.underscore',
            backbone: dirs.bower + 'backbone/backbone',
            nestedmodel: dirs.bower + 'backbone-nested-model/backbone-nested',
            d3: dirs.bower + 'd3/d3',
            nvd3: dirs.bower + 'nvd3/nv.d3',
            topojson: dirs.bower + 'topojson/topojson',
            deparam: dirs.bower + 'jquery-bbq-deparam/jquery-deparam'
        },

        // dynamically load all test files
        deps: tests,

        // we have to kickoff jasmine, as it is asynchronous
        callback: window.__karma__.start
    });
})();