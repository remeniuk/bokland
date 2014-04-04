/* global require, define */
(function() {
    'use strict';

    var dirs = {
        bower: '../../vendors/'
    };

    require.config({
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
            /*
            jquery: 'jquery',
            underscore: 'underscore',
            backbone: 'backbone',
            nestedmodel: 'nestedmodel',
            d3: 'd3',
            nvd3: 'nvd3',
            topojson: 'topojson',
            deparam: 'deparam'
            */
        }
    });

    define(['d3'], function(d3) {
        window.d3 || (window.d3 = d3);
        return window.d3;
    });
})();