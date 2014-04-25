/* global define */
define(function(require) {
    'use strict';

    // imports
    var $                  = require('jquery'),
        time               = require('helpers/time'),
        BaseView           = require('libs/view'),
        RouterManager      = require('./routers/manager'),
        CohortsView = require('./views/cohorts'),
        LoaderComponent    = require('components/loader/loader');


    // code
    var CohortsDashboardView = BaseView.extend({
        initialize: function() {
            var _this = this;

            _this.listenTo(_this.state, 'change', _this.navigate);
            _this.listenTo(RouterManager.cohorts, 'route:cohorts', _this.routing);
        },

        render: function() {
            var _this = this,
                view;

            view = new CohortsView({
                state: _this.state
            });
            _this.region('cohorts').show(view);

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

    var cohortsDashboardView = new CohortsDashboardView({
        el: body
    });
    cohortsDashboardView.render();

    // start routing
    if (!RouterManager.start()) {
        var range = time.period(new Date(), 'last-day-30');
        cohortsDashboardView.state.set('d._', [range]);
    }

    return cohortsDashboardView;
});