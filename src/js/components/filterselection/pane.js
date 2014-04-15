/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        BaseView = require('libs/view'),
        time = require('helpers/time'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/filterselection/pane'],
        criterionTemplate: templates['components/filterselection/criterion'],

        elementsUI: {
            'pane': '.filter-pane'
        },

        events: {
            'click a': '_removeCriterion'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;
            _this.filterModel = options.filterModel;

            _this.listenTo(_this.filterModel, 'sync', _this._initFilterPane);
            _this.listenTo(_this.state, 'change', _this.redraw);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            return _this;
        },

        redraw: function (action) {
            var _this = this;

            var formatValue = function(value){
                if(_.isDate(value)){
                    return time.param(value);
                } else {
                    return value;
                }
            };

            if (_this.filterMetaLoaded) {
                _this.ui.$pane.empty();
                _.each(_this.state.attributes, function (value, key) {
                    var criterionMeta = _this._findCriterionMeta(key);

                    if(!_.isUndefined(criterionMeta.name)){
                        _this.ui.$pane.append(_this.criterionTemplate({
                            id: key,
                            name: criterionMeta.name,
                            type: criterionMeta.type,
                            values: _.map(_.flatten(value._), formatValue)
                        }));
                    }
                });
            }

            return _this;
        },

        _initFilterPane: function () {
            var _this = this;

            _this.filterMetaLoaded = true;
            _this.redraw();

            return _this;
        },

        _findCriterionMeta: function (id) {
            var _this = this;

            var criteria = _.flatten(_.map(_this.filterModel.attributes, function (group) {
                return group.items;
            }));

            return _.find(criteria, function (criterion) {
                return criterion.id === id;
            });
        },

        _removeCriterion: function(ev) {
            var _this = this;

            var subjectCriterion = {};
            subjectCriterion[$(ev.currentTarget).parent().attr('criterion-id')] = undefined;

            _this.state.set(subjectCriterion, {unset: true});

            ev.preventDefault();
        }
    });

    return View;
});