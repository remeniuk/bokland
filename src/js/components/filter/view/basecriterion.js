/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        select2 = require('select2'),
        BaseView = require('libs/view');

    // code
    var View = BaseView.extend({

        elementsUI: {
            'criterionMultiValue': '[data-region=criterion-multi]',
            'criterionValue': '[data-region=criterion-value]',
            'criterionOperation': '[data-region=criterion-operation]'
        },

        events: {
            'change @ui.criterionOperation': 'changeOperation'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;
            _this.fieldName = options.fieldName;
            _this.values = options.values;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            _this.ui.$criterionMultiValue.select2();

            _this.redraw();

            return _this;
        },

        redraw: function () {
            var _this = this;

            _this.changeOperation();

            return _this;
        },

        fillState: function () {
            var _this = this,
                value = _this.ui.$criterionValue.val(),
                values = _this.ui.$criterionMultiValue.val(),
                filterCriteria = [],
                operation = _this.ui.$criterionOperation.val();

            var addFilterCriterion = function (value) {
                var filterOperation = {}, filterCriterion = {};

                filterOperation[operation] = value ? value : '';
                filterCriterion[_this.fieldName] = filterOperation;

                filterCriteria.push(filterCriterion);
            };

            if (values) {
                _.each(values, addFilterCriterion);
            } else {
                addFilterCriterion(value);
            }

            var query = JSON.parse(_this.state.get('query')), and;

            if (query.and) {
                and = _.clone(query.and);
                _.each(filterCriteria, function (criterion) {
                    and.push(criterion);
                });
                and = {and: and};
            } else {
                filterCriteria.push(query);
                and = {and: filterCriteria};
            }

            _this.state.set('query', JSON.stringify(and));
        }

    });

    return View;
});