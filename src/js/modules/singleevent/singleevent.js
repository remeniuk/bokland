/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                  = require('jquery'),
        time               = require('helpers/time'),
        BaseView           = require('libs/view'),
        DictionaryModel = require('../funnel/models/dictionary'),
        SingleEvent    = require('components/eventseq/view/single');

    var View = BaseView.extend({
        initialize: function() {
            var _this = this;

            _this.dictionaryModel = new DictionaryModel();
            _this.dictionaryModel.fetch();
        },

        render: function() {
            var _this = this,
                view;

            var region = _this.region('singleevent');

            var id = region.$el.attr('data-id');

            view = new SingleEvent({
                id: id,
                dictionaryModel: _this.dictionaryModel
            });
            region.show(view);

            _this.listenTo(_this.dictionaryModel, 'sync', function () {
                view.redraw();
            });

            return _this;
        }
    });

    var body = $('body').get(0);

    var view = new View({
        el: body
    });
    view.render();

    return view;
});