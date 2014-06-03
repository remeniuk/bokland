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

            BaseCriterion.prototype.redraw.call(_this, action);

            _this.values.forEach(function (value) {
                _this.ui.$criterionMultiValue.append('<option id=' + value.id + '>' + value.name + '</option>');
            });

            return _this;
        },

        changeOperation: function () {
            var _this = this;

            _this.ui.$criterionValue.removeClass('hidden');
            _this.ui.$criterionMultiValue.removeClass('hidden');

            switch(_this.ui.$criterionOperation.val()){
                case 'eql':
                case 'ne':
                    _this.ui.$criterionValue.addClass('hidden');
                    break;
                case 'contains':
                case 'not_contains':
                    _this.ui.$criterionMultiValue.addClass('hidden');
                    break;
                case 'null':
                case 'not_null':
                    _this.ui.$criterionValue.addClass('hidden');
                    _this.ui.$criterionMultiValue.addClass('hidden');
                    break;
                default:
                    break;
            }
        }
    });

    return View;
});