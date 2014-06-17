/* global define */
define(function (require) {
  'use strict';

  // imports
  var $ = require('jquery'),
    _ = require('underscore'),
    bootstrap = require('bootstrap'),
    BaseView = require('libs/view'),
    EventModel = require('components/eventseq/model/event'),
    EventView = require('components/eventseq/view/event'),
    config = require('config/api'),
    templates = require('templates/templates');

  // code
  var View = BaseView.extend({
    template: templates['components/eventseq/sequence'],

    elementsUI: {
      'sequence': '.sequence'
    },

    initialize: function (options) {
      var _this = this;

      _this.dictionary = options.dictionaryModel;
      _this.funnelMetaModel = options.funnelMetaModel;

      _this.newEvent = new EventModel({});

      _this.listenTo(_this.newEvent, 'create', _this._addEvent);

      _this.listenTo(_this.funnelMetaModel, 'sync', _this.redraw);
    },

    render: function () {
      var _this = this;

      _this.$el.html(_this.template({}));

      _this.bindUI();

      return _this;
    },

    guid: function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },

    redraw: function () {
      var _this = this;

      var newEventView = new EventView({
        model: _this.newEvent,
        dictionary: _this.dictionary,
        isNew: true
      });
      _this.$el.find('.sequence').append(newEventView.el);
      newEventView.render();

      _.each(_this.funnelMetaModel.get('data').sequence, function (event, idx) {
        event.guid = _this.guid();
        var eventModel = new EventModel(event);

        var eventView = new EventView({
          model: eventModel,
          dictionary: _this.dictionary
        });

        _this.listenTo(eventModel, 'submit', _this._submitEvent);
        _this.listenTo(eventModel, 'remove', _this._removeEvent);

        _this.$el.find('.sequence').append(eventView.el);
        eventView.render();
      });

      return _this;
    },

    _submitEvent: function (e) {
      var _this = this;

      var sequence = _.map(_this.funnelMetaModel.get('data').sequence, function(event){
        return event.guid == e.get('guid')?e.toJSON() : event;
      });

      _this.funnelMetaModel.get('data').sequence = sequence;
    },

    _removeEvent: function (e) {
      var _this = this;

      var sequence = _.filter(_this.funnelMetaModel.get('data').sequence, function(event){
        return event.guid != e.get('guid');
      });

      _this.funnelMetaModel.get('data').sequence = sequence;
    },

    _addEvent: function () {
      var _this = this;

      var _newEvent = _this.newEvent.clone();

      _this.funnelMetaModel.get('data').sequence.push(_newEvent.toJSON());

      var eventView = new EventView({
        model: _newEvent,
        dictionary: _this.dictionary
      });
      _this.$el.find('.sequence').append(eventView.el);
      eventView.render();

      _this.newEvent.clear();

      return _this;
    }
  });

  return View;
});