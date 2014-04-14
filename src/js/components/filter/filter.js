/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        CriterionModel = require('modules/dashboard/models/criterion'),
        CategoryCriterion = require('./categorycriterion'),
        DateCriterion = require('./datecriterion'),
        RangeCriterion = require('./rangecriterion'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/filter/filter'],

        elementsUI: {
            'selector': '.filter-selector select',
            'controls': '.filter-controls',
            'addFilter': '.filter-controls input'
        },

        events: {
            'change @ui.selector': '_selectCriterion',
            'click @ui.addFilter': '_addFilter'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;

            _this.filterModel = options.filterModel;
            _this.criterionModel = new CriterionModel();

            _this.listenTo(_this.filterModel, 'sync', _this.redraw);
            _this.listenTo(_this.criterionModel, 'sync', _this._renderCriterion);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            return _this;
        },

        redraw: function (action) {
            var _this = this;

            console.log('Redrawing filter');

            _.each(_this.filterModel.attributes, function(group){
                var $optgroup = $('<optgroup label="' + group.category + '"></optgroup>');
                _.each(group.items, function(item){
                    $optgroup.append('<option value="' + item.id + '">' + item.name + '</option>');
                });
                _this.ui.$selector.append($optgroup);
            });

            _this.ui.$selector.prop('selectedIndex', -1);

            return _this;
        },

        _selectCriterion: function () {
            var _this = this;

            console.log('Selected criterion ' + _this.ui.$selector.val());

            _this.criterionModel.set('id', _this.ui.$selector.val());
            _this.criterionModel.fetch();
        },

        _renderCriterion: function () {
            var _this = this;

            console.log('Rendering criterion');

            var criterionOptions = {
                state: _this.state.ref(_this.criterionModel.get('id')),
                values: _this.criterionModel.get('values')
            };

            switch(_this.criterionModel.get('type')) {
                case 'date':
                    console.log('Type date');
                    _this.filterCriterion = new DateCriterion(criterionOptions);
                    break;
                case 'category':
                    console.log('Type category');
                    _this.filterCriterion = new CategoryCriterion(criterionOptions);
                    break;
                case 'number':
                    console.log('Type range');
                    _this.filterCriterion = new RangeCriterion(criterionOptions);
                    break;
            }

            _this.region('criterion-conditions').show(_this.filterCriterion);

            _this.ui.$controls.removeClass('hidden');
        },

        _addFilter: function() {
            var _this = this;

            console.log('Adding filter');
            _this.filterCriterion.fillState();
        }
    });

    return View;
});