/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                  = require('jquery'),
        time               = require('helpers/time'),
        BaseView           = require('libs/view'),
        SequenceBuilder    = require('components/eventseq/view/sequence'),
        FilterWidget        = require('components/filter/filterwidget'),
        RouterManager      = require('../dashboard/routers/manager'),
        templates           = require('templates/templates');


    // code
    var FunnelView = BaseView.extend({
        template: templates['modules/funnel/funnel'],

        elementsUI: {
            'dashboardTitle': '[data-region=title]'
        },

        initialize: function (options) {
            var _this = this;

            /* jshint camelcase:false */
            _this.state.init({
                did: '', // dashboard id
                app_id: {}, // app id
                date: {},  // date
                p: {},  // platform
                s: {},  // source
                c: {},  // countries
                ch: {}  // segments
            });
            /* jshint camelcase:true */
        },


        render: function() {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var builder = new SequenceBuilder({});
            _this.region('sequence-builder').show(builder);

            var filterWidget = new FilterWidget({
                state: _this.state
            });
            _this.region('filter').show(filterWidget);

            _this.redraw();
        },

        redraw: function() {
            var _this = this;

            _this.ui.$dashboardTitle.val('Funnel');
        }
    });

    var FunnelDashboard = BaseView.extend({
        initialize: function (options) {
            var _this = this;

            _this.listenTo(_this.state, 'change', _this.navigate);
            _this.listenTo(RouterManager.funnel, 'route:dashboard', _this.routing);
        },

        render: function() {
            var _this = this;

            var view = new FunnelView({});
            _this.region('funnel').show(view);
        },

        routing: function(params) {
            var _this = this,
                state = _this.state;

            if (JSON.stringify(state.serialize()) !== JSON.stringify(params)) {
                state.fill(state.parse(params));
            }

            return _this;
        },

        navigate: function() {
            var _this = this,
                state = _this.state;

            RouterManager.navigate(state.serialize(), {trigger: false});

            return _this;
        }
    });

    // create views
    var body = $('body').get(0);

    var funnel = new FunnelDashboard({
        el: body
    });

    funnel.render();

    if (!RouterManager.start()) {
        var range = time.period(new Date(), 'last-day-7');
        funnel.state.set('date._', [range]);
    }

    return funnel;
});