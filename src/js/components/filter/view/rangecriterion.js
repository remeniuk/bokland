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

        changeOperation: function () {
            var _this = this, defaultValue;

            _this.ui.$criterionValue.removeClass('hidden');

            switch (_this.ui.$criterionOperation.val()) {
                case 'gt':
                case 'gte':
                    defaultValue = _this.values.from;
                    break;
                case 'lt':
                case 'lte':
                    defaultValue = _this.values.to;
                    break;
                case 'null':
                case 'not_null':
                    _this.ui.$criterionValue.addClass('hidden');
                    break;
                default:
                    break;
            }

            _this.ui.$criterionValue.val(defaultValue);
        }
    });

    return View;
});