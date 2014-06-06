/* global define */
define(function(require) {
    'use strict';

    // imports
    var $          = require('jquery'),
        _          = require('underscore'),
        RangeCriterion   = require('./rangecriterion'),
        templates  = require('templates/templates');

    // code
    var View = RangeCriterion.extend({
        template: templates['components/filter/datecriterion']
    });

    return View;
});