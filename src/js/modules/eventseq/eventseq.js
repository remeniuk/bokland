/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                  = require('jquery'),
        time               = require('helpers/time'),
        BaseView           = require('libs/view'),
        EventSequence    = require('components/eventseq/view/sequence');

    var View = BaseView.extend({
        initialize: function() {
            var _this = this;
        },

        render: function() {
            var _this = this,
                view;

            view = new EventSequence({
                state: _this.state
            });
            _this.region('eventseq').show(view);

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