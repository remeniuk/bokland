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
        template: templates['modules/funnel/segmentdialog'],

        elementsUI: {
            'segmentName': '#segment-name',
            'button': 'input.btn'
        },

        events: {
            'click @ui.button': '_createSegment'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;
            _this.funnelMetaModel = options.funnelMetaModel;

        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

            _this.listenTo(_this.funnelMetaModel, 'sync', function () {
              _this.ui.$segmentName.val(_this.funnelMetaModel.get('data').name);
            });

            return _this;
        },

        _createSegment: function (ev) {
          ev.preventDefault();

            var _this = this,
              segmentName = _this.ui.$segmentName.val();

            if(!segmentName){
              alert('Segment name should be defined!');
              return;
            }

            $.ajax({
              method: 'PUT',
              url: '/funnels/segment/' + _this.funnelMetaModel.get('id') + '/' + segmentName +
                '?' + $.param(_this.state.serialize()),
              success: function(response){
                alert("Segment hes been created successfully!");
              },
              error: function(response){
                alert(response.responseText);
              }
            });
        }

    });

    return View;
});