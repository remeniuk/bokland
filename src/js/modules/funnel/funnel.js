/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        time = require('helpers/time'),
        BaseView = require('libs/view'),
        SequenceBuilder = require('components/eventseq/view/sequence'),
        DictionaryModel = require('./models/dictionary'),
        FilterMetaModel = require('./models/meta'),
        FilterDataModel = require('./models/data'),
        ExportDialog = require('./views/exportdialog'),
        SegmentDialog = require('./views/segmentdialog'),
        FunnelWidget = require('components/widget-stats/funnel'),
        FilterWidget = require('components/filter/filterwidget'),
        RouterManager = require('../dashboard/routers/manager'),
        templates = require('templates/templates');


    // code
    var FunnelView = BaseView.extend({
        template: templates['modules/funnel/funnel'],

        elementsUI: {
            'dashboardTitle': '[data-region=title]',
            'cohortSelect': '[data-action=select-cohort]',
            'saveFunnelBtn': '[data-action=save-funnel]',
            'refreshFunnelBtn': '[data-action=refresh-funnel]',
            'exportFunnelBtn': '[data-action=export-funnel]',
            'createSegmentBtn': '[data-action=create-segment]',
            'goBackBtn': '[data-action=go-back]'
        },

        events: {
            'change @ui.cohortSelect': '_saveFunnel',
            'click @ui.saveFunnelBtn': '_saveFunnel',
            'click @ui.refreshFunnelBtn': '_refreshFunnel',
            'click @ui.goBackBtn': '_goBack'
        },

        initialize: function (options) {
            var _this = this;

            /* jshint camelcase:false */
            _this.state.init({
                query: '',
                fid: ''
            });
            /* jshint camelcase:true */

            _this.dictionaryModel = new DictionaryModel();

            _this.filterMetaModel = new FilterMetaModel();
            _this.filterMetaModel.dictionary = _this.dictionaryModel;

            _this.filterDataModel = new FilterDataModel();
            _this.filterDataModel.dictionary = _this.dictionaryModel;

            _this.listenTo(_this.dictionaryModel, 'sync', function () {
                _this.filterMetaModel.fetch();
            });
            _this.listenTo(_this.filterMetaModel, 'sync', _this.redraw);
            _this.listenTo(_this.filterDataModel, 'sync', function () {
            });
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var builder = new SequenceBuilder({
                dictionaryModel: _this.dictionaryModel,
                filterMetaModel: _this.filterMetaModel,
                state: _this.state
            });
            _this.region('sequence-builder').show(builder);

            var filterWidget = new FilterWidget({
                state: _this.state
            });
            _this.region('filter').show(filterWidget);

            var funnelWidget = new FunnelWidget({
                dictionaryModel: _this.dictionaryModel,
                filterDataModel: _this.filterDataModel,
                state: _this.state
            });
            _this.region('funnel').show(funnelWidget);

            var exportDialog = new ExportDialog();
            _this.region('export').show(exportDialog);

            var segmentDialog = new SegmentDialog();
            _this.region('create-segment').show(segmentDialog);

            _this.dictionaryModel.fetch();
        },

        redraw: function () {
            var _this = this;

            _this.ui.$dashboardTitle.val(_this.filterMetaModel.get('data').name);
            _this.ui.$cohortSelect.val(_this.filterMetaModel.get('data').cohort);

            _this.filterDataModel.fetch();
        },

        _saveFunnel: function () {
            var _this = this;

            _this.filterMetaModel.get('data').name = _this.ui.$dashboardTitle.val();
            _this.filterMetaModel.get('data').cohort = _this.ui.$cohortSelect.val();

            _this.filterMetaModel.save();
        },

        _refreshFunnel: function () {
            var _this = this;

            _this.filterDataModel.fetch();
        },

        _goBack: function () {
            var _this = this;

        }
    });

    var FunnelDashboard = BaseView.extend({
        initialize: function (options) {
            var _this = this;

            _this.listenTo(_this.state, 'change', _this.navigate);
            _this.listenTo(RouterManager.funnel, 'route:funnel', _this.routing);
        },

        render: function () {
            var _this = this;

            var view = new FunnelView({
                state: _this.state
            });
            _this.region('funnel').show(view);
        },

        routing: function (params) {
            var _this = this,
                state = _this.state;

            if (JSON.stringify(state.serialize()) !== JSON.stringify(params)) {
                state.fill(state.parse(params));
            }

            return _this;
        },

        navigate: function () {
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

        var query = {'and': [
            {'date': {'gt': time.param(range[0])}},
            {'date': {'lt': time.param(range[1])}}
        ]};

        funnel.state.set('query', JSON.stringify(query));
    }

    return funnel;
});