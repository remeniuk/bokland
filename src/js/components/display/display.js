/* global define */
define(function(require) {
    'use strict';

    // imports
    var BaseView  = require('views/base'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['components/display/display'],

        initialize: function(options) {
            var _this = this;

            // listen events
            _this.listenTo(_this.model, 'change', _this.render);
            _this.listenTo(_this.model, 'destroy', _this.remove);
        },

        render: function() {
            var _this = this,
                model = _this.model;

            _this.$el.html(_this.template({
                model: model.toJSON()
            }));

            return _this;
        }
    });

    return View;
});