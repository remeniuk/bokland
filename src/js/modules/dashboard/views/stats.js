/* global define */
define(function(require) {
    'use strict';

    // imports
    var BaseView             = require('libs/view'),
        DateDisplayComponent = require('components/dropdowns/datedisplay'),
        RowChartWidget       = require('components/widget-stats/rowchart'),
        templates            = require('templates/templates');


    // code
    var View = BaseView.extend({
        template: templates['modules/dashboard/stats'],

        initialize: function() {
            var _this = this;

            _this.state.init({
                d: {},  // date
                p: {},  // platform
                s: {},  // source
                c: {},  // countries
                ch: {}  // segments
            });
        },

        render: function() {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var dateDisplay = new DateDisplayComponent({
                state: _this.state.ref('d')
            });
            _this.region('date-display').show(dateDisplay);

            var platformsChart = new RowChartWidget({
                collection: _this.collection,
                name: 'platforms',
                state: _this.state.ref('p'),
                title: 'Platforms',
                settings: {
                    defaults: ['revenue'],
                    opts: {
                        'uniques': 'Uniques',
                        'revenue': 'Revenue',
                        'payers': 'Payers',
                        'registrations': 'Registrations'
                    }
                }
            });
            _this.region('platforms').show(platformsChart);

            var sourcesChart = new RowChartWidget({
                collection: _this.collection,
                name: 'sources',
                state: _this.state.ref('s'),
                title: 'Sources',
                settings: {
                    defaults: ['revenue'],
                    opts: {
                        'uniques': 'Uniques',
                        'revenue': 'Revenue',
                        'payers': 'Payers',
                        'registrations': 'Registrations'
                    }
                }
            });
            _this.region('sources').show(sourcesChart);

            var segmentsChart = new RowChartWidget({
                collection: _this.collection,
                name: 'segments',
                state: _this.state.ref('ch'),
                max: 20,
                title: 'Segments',
                settings: {
                    defaults: ['revenue'],
                    opts: {
                        'uniques': 'Uniques',
                        'revenue': 'Revenue',
                        'payers': 'Payers',
                        'registrations': 'Registrations'
                    }
                }
            });
            _this.region('segments').show(segmentsChart);

            var countriesTopChart = new RowChartWidget({
                collection: _this.collection,
                name: 'countries',
                state: _this.state.ref('c'),
                max: 15,
                title: 'Countries',
                settings: {
                    defaults: ['revenue'],
                    opts: {
                        'uniques': 'Uniques',
                        'revenue': 'Revenue',
                        'payers': 'Payers',
                        'registrations': 'Registrations'
                    }
                }
            });
            _this.region('countries-top').show(countriesTopChart);

            return _this;
        }
    });

    return View;
});