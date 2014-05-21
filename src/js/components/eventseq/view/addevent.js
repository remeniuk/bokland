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
            'addEventDialogModal': '.add-event-dialog-modal-sm',
            'selectedOperation': '#operation',
            'selectedEvent': '#event',
            'selectedItem': '#item',
            'paramLowerBound': '#from-param',
            'paramUpperBound': '#to-param',
            'paramEquals': '#param'
        },

        events: {
            'click @ui.submit': '_submitEvent',
            'click @ui.remove': '_removeEvent',
            'change @ui.selectedOperation': '_selectOperation'
        },

        initialize: function (options) {
            var _this = this;

            _this.model = options.model;
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template(_this.model.toJSON()));

            _this.bindUI();

            _this._populate();

            _this.redraw();

            return _this;
        },

        open: function() {
          var _this = this;

          _this.ui.$addEventDialogModal.modal();
        },

        _submitEvent: function (ev) {
            var _this = this;

            var eventId = _this.ui.$selectedEvent.val(),
                eventName = _this.ui.$selectedEvent.find('option:selected').text(),
                itemId = _this.ui.$selectedItem.val(),
                operation = _this.ui.$selectedOperation.val(),
                lowerBound = _this.ui.$paramLowerBound.val(),
                upperBound = _this.ui.$paramUpperBound.val(),
                param = _this.ui.$paramEquals.val();

            _this.model.set('id', eventId);
            _this.model.set('name', eventName);
            if(itemId !== '-1') {
                _this.model.set('item_id', itemId);
            } else {
                _this.model.unset('item_id');
            }
            if(operation !== '-1') {
                var operationObj = {};
                operationObj.type = operation;

                if(lowerBound) {
                    operationObj.from = lowerBound;
                }
                if(upperBound) {
                    operationObj.to = upperBound;
                }
                if(param) {
                    operationObj.value = param;
                }

                _this.model.set('parameter', operationObj);
            } else {
                _this.model.unset('parameter');
            }

            console.log('Submitting event: ' + JSON.stringify(_this.model.toJSON()));

            _this.model.trigger('submit');

            // TODO: add validation

            ev.preventDefault();
        },

        _removeEvent: function (ev) {
            var _this = this;

            _this.model.trigger('remove');
        },

        _populate: function() {
            var _this = this;

            // TODO: load types of events end items from server

            var events = [ {id: '1', name: 'Event #1'}, {id: '2', name: 'Event #2'}, {id: '3', name: 'Event #3'},
                {id: '4', name: 'Event #4'}, {id: '5', name: 'Event #5'} ];

            var items = [ {id: '1', name: 'Item #1'}, {id: '2', name: 'Item #2'}, {id: '3', name: 'Item #3'},
                {id: '4', name: 'Item #4'}, {id: '5', name: 'Item #5'} ];

            _.each(items, function(item){
                _this.ui.$selectedItem.append('<option value="' + item.id + '">' + item.name + '</option>');
            });

            _.each(events, function(event){
                _this.ui.$selectedEvent.append('<option value="' + event.id + '">' + event.name + '</option>');
            });
        },

        redraw: function() {
            var _this = this;

            _this.ui.$selectedEvent.val(_this.model.get('id'));

            var itemId = _this.model.get('item_id');
            _this.ui.$selectedItem.val(itemId ? itemId : '-1');

            var parameter = _this.model.get('parameter');
            if(parameter){
                _this.ui.$selectedOperation.val(parameter.type);
                _this.ui.$selectedOperation.trigger('change');

                _this.ui.$paramLowerBound.val(parameter.from);
                _this.ui.$paramUpperBound.val(parameter.to);
                _this.ui.$paramEquals.val(parameter.value);
            }
        },

        _selectOperation: function(ev) {
            var _this = this;

            switch(_this.ui.$selectedOperation.val()){
                case '-1':
                    _this.ui.$paramLowerBound.addClass('hidden');
                    _this.ui.$paramUpperBound.addClass('hidden');
                    _this.ui.$paramEquals.addClass('hidden');
                    break;
                case 'gt':
                    _this.ui.$paramLowerBound.removeClass('hidden');
                    _this.ui.$paramUpperBound.addClass('hidden');
                    _this.ui.$paramEquals.addClass('hidden');
                    break;
                case 'lt':
                    _this.ui.$paramLowerBound.addClass('hidden');
                    _this.ui.$paramUpperBound.removeClass('hidden');
                    _this.ui.$paramEquals.addClass('hidden');
                    break;
                case 'eq':
                    _this.ui.$paramLowerBound.addClass('hidden');
                    _this.ui.$paramUpperBound.addClass('hidden');
                    _this.ui.$paramEquals.removeClass('hidden');
                    break;
                case 'btw':
                    _this.ui.$paramLowerBound.removeClass('hidden');
                    _this.ui.$paramUpperBound.removeClass('hidden');
                    _this.ui.$paramEquals.addClass('hidden');
                    break;
            }

            ev.preventDefault();
        }

    });

    return View;
});