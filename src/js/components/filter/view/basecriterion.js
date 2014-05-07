/* global define */
define(function(require) {
    'use strict';

    // imports
    var $          = require('jquery'),
        _          = require('underscore'),
        select2     = require('select2'),
        BaseView   = require('libs/view');

    // code
    var View = BaseView.extend({

        elementsUI: {
            'multi': '[data-region=criterion-multi]',
            'from': '[data-region=criterion-from]',
            'to': '[data-region=criterion-to]'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;
            _this.values = options.values;
        },

        render: function() {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            _this.ui.$multi.select2();

            _this.redraw();

            return _this;
        }

    });

    return View;
});