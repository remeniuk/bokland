/* global define */
define(function(require) {
    'use strict';

    // imports
    var _         = require('underscore'),
        d3        = require('d3'),
        time      = require('helpers/time'),
        BaseView  = require('libs/view'),
        templates = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['components/dropdowns/datedisplay'],

        events: {
            'click @ui.item': '_range'
        },

        elementsUI: {
            'display': null,
            'item': '[data-range]'
        },

        periods: [
            'current-day',
            'current-week',
            'current-month',
            'current-year',
            'last-day-7',
            'last-day-30'
        ],


        initialize: function(options) {
            var _this = this;

            _this.state.init('_', []);

            _this.listenTo(_this.state, 'change', _this.redraw);
        },

        render: function() {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();
            _this.redraw();

            return _this;
        },

        redraw: function() {
            var _this = this,
                range = _this.state.get('_'),
                ui = _this.ui,
                $display = ui.$display,
                $items = ui.$item,
                format = d3.time.format('%x'),
                periods = _this.periods,
                info = '-',
                potential;

            if (!_.isEmpty(range)) {
                range = range[0];           // parse format like d[_][0][]=2014-03-29~d[_][0][]=2014-04-05
                info = format(range[0]) + ' - ' + format(range[1]);

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
            }

            // display info
            $display.text(info);

            _this.trigger('display', _this, info, range);

            return _this;
        },

        _range: function(e) {
            var _this = this,
                option = _this.$(e.currentTarget).attr('data-range'),
                range;

            if (option !== 'all') {
                range = [_this._period(option)];    // set in format like d[_][0][]=2014-03-29~d[_][0][]=2014-04-05
            }
            _this.state.set('_', range || []);

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