/* global define */
define(function(require) {
    'use strict';

    // imports
    var d3        = require('d3'),
        time      = require('helpers/time'),
        BaseView  = require('libs/view'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['components/dropdowns/datedisplay'],

        className: 'components-dropdown',

        events: {
            'click @ui.item': '_range'
        },

        elementsUI: {
            'display': null,
            'item': '[data-range]'
        },

        periods: [
            'current-day', 'current-week', 'current-month', 'current-year',
            'last-day-7', 'last-day-30'
        ],


        initialize: function(options) {
            var _this = this;
            _this.daterange = options.daterange;
            _this.listenTo(_this.daterange, 'display', _this.redraw);
        },

        render: function() {
            var _this = this;
            _this.$el.html(_this.template({}));
            _this.bindUI();
            return _this;
        },

        redraw: function(range) {
            var _this = this,
                ui = _this.ui,
                $display = ui.$display,
                $items = ui.$item,
                format = d3.time.format('%x'),
                periods = _this.periods,
                potential;

            if (range) {
                $display.text(format(range[0]) + ' - ' + format(range[1]));
            } else {
                $display.text('-');
            }

            // selection detect
            $items.removeClass('active');
            for (var i in periods) {
                potential = _this._period(periods[i]);
                if (potential) {
                    if (Number(potential[0]) === Number(range[0]) && Number(potential[1]) === Number(range[1])) {
                        $items.filter('[data-range="' + periods[i] + '"]').addClass('active');
                        break;
                    }
                }
            }

            return _this;
        },

        _range: function(e) {
            var _this = this,
                option = $(e.currentTarget).attr('data-range'),
                range;

            range = _this._period(option);
            _this.daterange.range(range);

            e.preventDefault();
        },

        _period: function(option) {

            var today = time.today(),
                period = time.period,
                range;

            range = period(today, option);

            if (range) {
                range[1] = range[1] < today ? range[1] : today;
            }

            return range;
        }

    });

    return View;
});