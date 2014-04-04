/* global define */
define(function(require) {
    'use strict';

    // imports
    var d3 = require('d3');


    // code
    var _compositeFormat = function(formats) {
        return function(date) {
            var i = formats.length - 1,
                f = formats[i];

            while (!f[1](date)) {
                f = formats[--i];
            }
            return f[0](date);
        };
    };

    var _defaultTimeFormat = _compositeFormat([
        [d3.time.format('%Y'), function() { return true; }],
        [d3.time.format('%b %d'), function(d) { return d.getMonth(); }],
        [d3.time.format('%b %d'), function(d) { return d.getDate() !== 1; }],
        [d3.time.format(''), function(d) { return d.getHours(); }],
        [d3.time.format(''), function(d) { return d.getMinutes(); }],
        [d3.time.format(''), function(d) { return d.getSeconds(); }],
        [d3.time.format(''), function(d) { return d.getMilliseconds(); }]
    ]);

    return {
        compositeFormat: _compositeFormat,
        defaultTimeFormat: _defaultTimeFormat
    };
});