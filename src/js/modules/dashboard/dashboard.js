/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                  = require('jquery'),
        time               = require('helpers/time'),
        BaseView           = require('libs/view'),
        RouterManager      = require('./routers/manager'),
        SeriesCollection   = require('./collections/series'),
        DashboardStatsView = require('./views/stats'),
        LoaderComponent    = require('components/loader/loader');


    // code
    var DashboardView = BaseView.extend({
        initialize: function() {
            var _this = this;

            _this.collection = new SeriesCollection([], {
                params: _this.state
            });

            _this.listenTo(_this.state, 'change', _this.navigate);
            _this.listenTo(RouterManager.dashboard, 'route:dashboard', _this.routing);
        },

        render: function() {
            var _this = this,
                view;

            view = new DashboardStatsView({
                id: '536b8979682cfa5294504719',
                collection: _this.collection,
                state: _this.state
            });
            _this.region('dashboard.stats').show(view);

            return _this;
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

    var loader = new LoaderComponent({
        root: body
    });
    loader.render();

    var dashboard = new DashboardView({
        el: body
    });
    dashboard.render();

    // start routing
    if (!RouterManager.start()) {
        var range = time.period(new Date(), 'last-day-7');
        dashboard.state.set('d._', [range]);
    }

    return dashboard;
});