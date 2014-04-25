/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseCriterion = require('./basecriterion'),
        templates = require('templates/templates');

    // code
    var View = BaseCriterion.extend({
        template: templates['components/filter/categorycriterion'],

        redraw: function (action) {
            var _this = this;

            _this.values.forEach(function (value) {
                _this.ui.$multi.append('<option id=' + value.id + '>' + value.name + '</option>');
            });

            return _this;
        },

        fillState: function () {
            var _this = this;
            _this.state.set('_', _this.ui.$multi.val());
        }
    });

    return View;
});