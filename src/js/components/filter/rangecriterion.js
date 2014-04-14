/* global define */
define(function(require) {
    'use strict';

    // imports
    var $          = require('jquery'),
        _          = require('underscore'),
        BaseCriterion   = require('./basecriterion'),
        templates  = require('templates/templates');

    // code
    var View = BaseCriterion.extend({
        template: templates['components/filter/rangecriterion'],

        redraw: function(action) {
            var _this = this;

            _this.ui.$from.val(_this.values.from);
            _this.ui.$to.val(_this.values.to);

            return _this;
        },

        fillState: function () {
            var _this = this;
            _this.state.set('_', [_this.ui.$from.val(), _this.ui.$to.val()]);
        }
    });

    return View;
});