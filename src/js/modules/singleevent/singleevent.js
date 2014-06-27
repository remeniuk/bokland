/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        time = require('helpers/time'),
        BaseView = require('libs/view'),
        DictionaryModel = require('../funnel/models/dictionary'),
        SingleEvent = require('components/eventseq/view/single');

    var View = BaseView.extend({
        initialize: function () {
            var _this = this;

            _this.dictionaryModel = new DictionaryModel();
            _this.dictionaryModel.fetch();
        },

        render: function () {
            var _this = this;

            var regions = $('[data-region=singleevent]');


            var views = regions.map(function (idx, region) {
                var id = $(region).attr('data-id');

                var view = new SingleEvent({
                    id: id,
                    dictionaryModel: _this.dictionaryModel
                });
                $(region).empty();
                $(region).append(view.$el);
                view.render();

                if(_this.dictionaryModel.fetched){
                    view.redraw();
                }

                return view;
            });

            _this.listenTo(_this.dictionaryModel, 'sync', function () {
                _this.dictionaryModel.fetched = true;
                _.each(views, function (view) {
                    view.redraw();
                });
            });

            return _this;
        }
    });

    var body = $('body').get(0);

    var view = new View({
        el: body
    });
    view.render();

    $('body').bind('new-single-event', function(){
        console.log('Added new single event!');
        view.render();
    });

    return view;
});