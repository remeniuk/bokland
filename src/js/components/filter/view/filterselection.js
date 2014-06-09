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

        ignoredKeys: ['did'],

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

            var formatValue = function (value) {
                if (_.isDate(value)) {
                    return time.param(value);
                } else {
                    return value;
                }
            };

            if (_this.filterMetaLoaded) {
                _this.ui.$pane.empty();

                var queryString = _this.state.get('query'),
                    query;

                try {
                    query = JSON.parse(queryString);
                } catch (e) {
                    console.log(e);
                }

                var parseCriterion = function (object) {
                    var tuple = _.chain(object).pairs(object).first().value();
                    var valueTuple = _.chain(tuple[1]).pairs(object).first().value();
                    return {
                        'key': tuple[0],
                        'operation': valueTuple[0],
                        'value': valueTuple[1]
                    };
                };

                var operationLabel = function (operation) {
                    var mapping = {
                        'gt': '>',
                        'lt': '<',
                        'gte': '>=',
                        'lte': '<=',
                        'eql': '=',
                        'ne': '!=',
                        'contains': '~=',
                        'not_contains': '!~=',
                        'null': 'is empty',
                        'not_null': 'is not empty'
                    };

                    return mapping[operation] ? mapping[operation] : operation;
                };

                if (query) {
                    var renderFilterCriteria = function (criteria) {
                        _.each(criteria, function (criterion) {
                            var parsedCriterion = parseCriterion(criterion);
                            switch (parsedCriterion.key) {
                                case 'and':
                                    break;
                                case 'or':
                                    break;
                                default:
                                    var criterionMeta = _this._findCriterionMeta(parsedCriterion.key);
                                    var value = formatValue(parsedCriterion.value);
                                    if (criterionMeta) {
                                        _this.ui.$pane.append(_this.criterionTemplate({
                                            id: parsedCriterion.key,
                                            name: criterionMeta.name,
                                            type: criterionMeta.type,
                                            operationId: parsedCriterion.operation,
                                            operation: operationLabel(parsedCriterion.operation),
                                            value: value
                                        }));
                                    }
                                    break;
                            }
                        });
                    };
                    _.each(query, function (value, key) {
                        switch (key) {
                            case 'and':
                                renderFilterCriteria(value);
                                break;
                            case 'or':
                                break;
                            default:
                                renderFilterCriteria([value]);
                                break;
                        }
                    });
                }
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

        _removeCriterion: function (ev) {
            var _this = this;

            var criterionId =  $(ev.currentTarget).parent().attr('criterion-id'),
                criterionOperaton =  $(ev.currentTarget).parent().attr('criterion-operation'),
                criterionValue =  $(ev.currentTarget).parent().attr('criterion-value');

            var query = JSON.parse(_.clone(_this.state.get('query')));
            query.and = _.filter(query.and, function(criterion){
                /* jshint eqeqeq:false */
                // fixme: is it really need to use '==' instead '==='?
                return !(criterion[criterionId] &&
                    criterion[criterionId][criterionOperaton] == criterionValue);
                /* jshint eqeqeq:true */
            });

            _this.state.set('query', JSON.stringify(query));

            ev.preventDefault();
        }
    });

    return View;
});