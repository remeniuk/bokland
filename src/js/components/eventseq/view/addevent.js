/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        template: templates['components/eventseq/addeventialog'],

        elementsUI: {
            'submit': '#submit',
            'remove': '#remove',
            'eventFormGroup': '#event-form-group',
            'operationFormGroup': '#operation-form-group',
            'addEventDialogModal': '.add-event-dialog-modal-sm',
            'selectedOperation': '#operation',
            'selectedEvent': '#event',
            'selectedItem': '#item',
            'itemFormGroup': '#item-form-group',
            'paramLowerBound': '#from-param',
            'paramUpperBound': '#to-param',
            'paramEquals': '#param',
            'paramString': '#param-string'
        },

        events: {
            'click @ui.submit': '_submitEvent',
            'click @ui.remove': '_removeEvent',
            'change @ui.selectedEvent': function (ev) {
                this.ui.$selectedOperation.val('-1');
                this._selectOperation(ev);
            },
            'change @ui.selectedOperation': '_selectOperation'
        },

        initialize: function (options) {
            var _this = this;

            _this.model = options.model;
            _this.dictionary = options.dictionary;
            _this.addNew = options.addNew;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template(_this.model.toJSON()));

            _this.bindUI();

            if (_this.addNew) {
                _this.ui.$remove.hide();
            } else {
                _this.ui.$remove.show();
            }

            _this._populate(_this.dictionary);

            return _this;
        },

        open: function () {
            var _this = this;

            _this.redraw();
            _this.ui.$addEventDialogModal.modal();
        },

        _submitEvent: function (ev) {
            var _this = this;
            var valid = true;

            var eventId = _this.ui.$selectedEvent.val(),
                event = _this._findEvent(eventId),
                eventName = _this.ui.$selectedEvent.find('option:selected').text(),
                itemId = _this.ui.$selectedItem.val(),
                itemName = _this.ui.$selectedItem.find('option:selected').text(),
                operation = _this.ui.$selectedOperation.val(),
                lowerBound = _this.ui.$paramLowerBound.val(),
                upperBound = _this.ui.$paramUpperBound.val(),
                param = _this.ui.$paramEquals.val(),
                paramString = _this.ui.$paramString.val(),
                paramStringName = _this.ui.$paramString.find('option:selected').text();

            valid = valid && eventId !== '-1';

            _this.model.set('id', eventId);
            if (eventId === '-1') {
                _this.ui.$eventFormGroup.addClass('has-error');
            }

            _this.model.set('name', eventName);
            if (itemId !== '-1') {
                _this.model.set('item_id', itemId);
                _this.model.set('item_name', itemName);
            } else {
                _this.model.unset('item_id');
                _this.model.unset('item_name');
            }
            if (operation !== '-1') {
                var operationObj = {};
                operationObj.type = operation;

                switch (event.settingType) {
                    case 'apps':
                        _this.model.set('item_id', paramString);
                        _this.model.set('item_name', paramStringName);

                        break;

                    case 'settings':
                        switch (event.paramType) {
                            case 'seconds_since_registration':
                                lowerBound = lowerBound ? lowerBound * 60 * 60 * 24 : lowerBound;
                                upperBound = upperBound ? upperBound * 60 * 60 * 24 : upperBound;
                                param = param ? param * 60 * 60 * 24 : param;
                                break;

                            case 'seconds_since_epoch':
                                lowerBound = lowerBound ? new Date(lowerBound).getTime() / 1000 : lowerBound;
                                upperBound = upperBound ? new Date(upperBound).getTime() / 1000 : upperBound;
                                param = param ? new Date(param).getTime() / 1000 : param;
                                break;
                        }

                        if (lowerBound) {
                            operationObj.from = lowerBound;
                        }
                        if (upperBound) {
                            operationObj.to = upperBound;
                        }
                        if (param || paramString) {
                            operationObj.from = operationObj.to = _this.ui.$paramString.is(":visible") ? paramString : param;
                        }

                        var unsigned = /^[0-9]\d*$/;

                        var operationValid = true;

                        operationValid = operationValid && ((operationObj.from && operationObj.from.toString().match(unsigned)) ||
                            (operationObj.to && operationObj.to.toString().match(unsigned)));

                        if (operation === 'btw' && lowerBound && lowerBound.toString().match(unsigned) && upperBound &&
                            upperBound.toString().match(unsigned)) {
                            operationValid = operationValid && (parseInt(upperBound) > parseInt(lowerBound));
                        } else {
                            operationValid = operationValid && operation !== 'btw';
                        }

                        if (!operationValid) {
                            _this.ui.$operationFormGroup.addClass('has-error');
                        }

                        valid = valid && operationValid;

                        _this.model.set('parameter', operationObj);
                        break;
                }
            } else {
                _this.model.unset('parameter');
            }

            console.log('Submitting event: ' + JSON.stringify(_this.model.toJSON()));

            if (valid) {
                if (!_this.addNew) {
                    _this.model.trigger('submit', _this.model);
                } else {
                    _this.model.trigger('create', _this.model);
                }

                _this.ui.$eventFormGroup.removeClass('has-error');
                _this.ui.$operationFormGroup.removeClass('has-error');

                _this.ui.$addEventDialogModal.modal('hide');
            }

            ev.preventDefault();
        },

        _removeEvent: function (ev) {
            var _this = this;

            _this.model.trigger('remove', _this.model);
        },

        _populate: function (dictionary) {
            var _this = this;

            _.each(dictionary.get('settings'), function (item) {
                _this.ui.$selectedItem.append('<option value="' + item.id + '">' + item.name + '</option>');
            });

            _.each(dictionary.get('events'), function (event) {
                _this.ui.$selectedEvent.append('<option value="' + event.id + '">' + event.name + '</option>');
            });
        },

        // todo extract to library
        _findEvent: function (eventId) {
            var _this = this;

            return _.find(_this.dictionary.get('events'), function (event) {
                return event.id == eventId;
            });
        },

        redraw: function () {
            var _this = this;

            Date.prototype.toDateInputValue = (function () {
                var local = new Date(this);
                local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
                return local.toJSON().slice(0, 10);
            });

            var eventId = _this.model.get('id');
            _this.ui.$selectedEvent.val(eventId >= 0 ? eventId : '-1');

            var itemId = _this.model.get('item_id');
            _this.ui.$selectedItem.val(itemId >= 0 ? itemId : '-1');

            var parameter = _this.model.get('parameter');

            var event = _this._findEvent(eventId);

            if (parameter) {
                _this.ui.$selectedOperation.val(parameter.type);
                _this.ui.$selectedOperation.trigger('change');

                var from = parameter.from, to = parameter.to, equals = parameter.equals;

                switch (event.settingType) {
                    case 'settings':

                        switch (event.paramType) {

                            case 'seconds_since_registration':
                                from = from ? from / (60 * 60 * 24) : from;
                                to = to ? to / (60 * 60 * 24) : to;
                                equals = equals ? equals / (60 * 60 * 24) : equals;
                                break;

                            case 'seconds_since_epoch':
                                from = from ? new Date(from * 1000).toDateInputValue() : from;
                                to = to ? new Date(to * 1000).toDateInputValue() : to;
                                equals = equals ? new Date(equals * 1000).toDateInputValue() : equals;
                                break;

                        }
                        break;
                }


                _this.ui.$paramLowerBound.val(from);
                _this.ui.$paramUpperBound.val(to);
                _this.ui.$paramEquals.val(from);

                _this.ui.$paramString.val(from);
            } else {
                _this.ui.$selectedOperation.trigger('change');

                if (event) switch (event.settingType) {
                    case 'settings':
                        _this.ui.$selectedOperation.val('-1');
                        _this.ui.$paramString.addClass('hidden').val('');
                        break;

                    case 'apps':
                        if (itemId) {
                            _this.ui.$selectedOperation.val('eq');
                            _this.ui.$paramString.removeClass('hidden').val(itemId);
                        }
                        break;
                }

                _this.ui.$paramLowerBound.addClass('hidden').val('');
                _this.ui.$paramUpperBound.addClass('hidden').val('');
                _this.ui.$paramEquals.addClass('hidden').val('');
            }
        },

        _selectOperation: function (ev) {
            var _this = this;

            var selectedOperation = _this.ui.$selectedOperation.val();
            _this.ui.$selectedOperation.empty();
            _this.ui.$selectedOperation.append('<option value="-1">Any parameter</option>');
            _this.ui.$selectedOperation.append('<option value="eq">Equal</option>');
            _this.ui.$selectedOperation.val(selectedOperation);

            var eventId = _this.ui.$selectedEvent.val();
            var event = _this._findEvent(eventId);

            // TODO refactor to strategy
            var displayControls = function () {
                _this.ui.$selectedOperation.append('<option value="gt">Greater</option>');
                _this.ui.$selectedOperation.append('<option value="lt">Lower</option>');
                _this.ui.$selectedOperation.append('<option value="btw">Between</option>');
                _this.ui.$selectedOperation.val(selectedOperation);

                switch (selectedOperation) {
                    case '-1':
                        _this.ui.$paramLowerBound.addClass('hidden').val(undefined);
                        _this.ui.$paramUpperBound.addClass('hidden').val(undefined);
                        _this.ui.$paramEquals.addClass('hidden').val(undefined);
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                        break;
                    case 'gt':
                        _this.ui.$paramLowerBound.removeClass('hidden').val(undefined);
                        _this.ui.$paramUpperBound.addClass('hidden').val(undefined);
                        _this.ui.$paramEquals.addClass('hidden').val(undefined);
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                        break;
                    case 'lt':
                        _this.ui.$paramLowerBound.addClass('hidden').val(undefined);
                        _this.ui.$paramUpperBound.removeClass('hidden').val(undefined);
                        _this.ui.$paramEquals.addClass('hidden').val(undefined);
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                        break;
                    case 'eq':
                        _this.ui.$paramLowerBound.addClass('hidden').val(undefined);
                        _this.ui.$paramUpperBound.addClass('hidden').val(undefined);
                        _this.ui.$paramEquals.removeClass('hidden').val(undefined);
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                        break;
                    case 'btw':
                        _this.ui.$paramLowerBound.removeClass('hidden').val(undefined);
                        _this.ui.$paramUpperBound.removeClass('hidden').val(undefined);
                        _this.ui.$paramEquals.addClass('hidden').val(undefined);
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                        break;
                }
            };

            var changeInputType = function (type) {
                _this.ui.$paramLowerBound.attr('type', type);
                _this.ui.$paramUpperBound.attr('type', type);
                _this.ui.$paramEquals.attr('type', type);
            };

            if (event) switch (event.settingType) {
                case 'settings':

                    switch (event.paramType) {

                        case 'string':
                            _this.ui.$paramString.empty();
                            _.each(_.pairs(event.paramValues), function (param) {
                                _this.ui.$paramString.append('<option value="' + param[1] + '">' + param[0] + '</option>');
                            });

                            _this.ui.$paramLowerBound.addClass('hidden').val(undefined);
                            _this.ui.$paramUpperBound.addClass('hidden').val(undefined);
                            _this.ui.$paramEquals.addClass('hidden').val(undefined);

                            if (_this.ui.$selectedOperation.val() != '-1') {
                                _this.ui.$paramString.removeClass('hidden');
                            } else {
                                _this.ui.$paramString.addClass('hidden').val(undefined);
                            }

                            _this.ui.$itemFormGroup.removeClass('hidden');

                            break;

                        case 'int':
                            changeInputType('number');
                            displayControls();
                            _this.ui.$itemFormGroup.removeClass('hidden');

                            break;

                        case 'seconds_since_registration':
                            changeInputType('number');
                            displayControls();
                            _this.ui.$selectedItem.val('-1');
                            _this.ui.$itemFormGroup.addClass('hidden');

                            break;

                        case 'seconds_since_epoch':
                            changeInputType('date');
                            displayControls();
                            _this.ui.$selectedItem.val('-1');
                            _this.ui.$itemFormGroup.addClass('hidden');

                            break;

                    }

                    break;

                case 'apps':
                    _this.ui.$paramString.empty();
                    _.each(_this.dictionary.get('apps'), function (param) {
                        _this.ui.$paramString.append('<option value="' + param.id + '">' + param.name + '</option>');
                    });

                    _this.ui.$paramLowerBound.addClass('hidden').val(undefined);
                    _this.ui.$paramUpperBound.addClass('hidden').val(undefined);
                    _this.ui.$paramEquals.addClass('hidden').val(undefined);

                    if (_this.ui.$selectedOperation.val() != '-1') {
                        _this.ui.$paramString.removeClass('hidden');
                    } else {
                        _this.ui.$paramString.addClass('hidden').val(undefined);
                    }

                    _this.ui.$itemFormGroup.addClass('hidden');

                    break;

            }

            ev.preventDefault();
        }

    });

    return View;
});