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
            drilldown: {
                deps: [
                    'jquery'
                ]
            },
            nestedmodel: ['backbone'],
            d3: {
                exports: 'd3'
            },
            bootstrap: {
                deps: [
                    'jquery'
                ],
                exports: 'bootstrap'
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
            deparam: ['jquery'],
            pivottable: {
                deps: [
                    'jquery'
                ]
            }
        },
        paths: {
            jquery: dirs.bower + 'jquery/dist/jquery',
            pivottable: dirs.bower + 'pivottable/dist/pivot',
            bootstrap: dirs.bower + 'bootstrap/dist/js/bootstrap',
            multiselect: dirs.bower + 'bootstrap-multiselect/js/bootstrap-multiselect',
            underscore: dirs.bower + 'underscore/underscore',
            // underscore: dirs.bower + 'lodash/dist/lodash.underscore',
            drilldown: dirs.bower + 'jquery-drilldown/jquery.drilldown',
            backbone: dirs.bower + 'backbone/backbone',
            nestedmodel: dirs.bower + 'backbone-nested-model/backbone-nested',
            d3: dirs.bower + 'd3/d3',
            nvd3: dirs.bower + 'nvd3/nv.d3',
            topojson: dirs.bower + 'topojson/topojson',
            deparam: dirs.bower + 'jquery-bbq-deparam/jquery-deparam'
        }
    });

    define(['d3'], function(d3) {
        window.d3 || (window.d3 = d3);
        return window.d3;
    });

})();