/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        cookie = require('libs/jquery.cookie'),
        time = require('helpers/time'),
        BaseView = require('libs/view'),
        SequenceBuilder = require('components/eventseq/view/sequence'),
        DictionaryModel = require('./models/dictionary'),
        FunnelMetaModel = require('./models/meta'),
        FunnelDataModel = require('./models/data'),
        ExportDialog = require('./views/exportdialog'),
        SegmentDialog = require('./views/segmentdialog'),
        FunnelWidget = require('components/widget-stats/funnel'),
        FilterWidget = require('components/filter/filterwidget'),
        RouterManager = require('./routers/manager'),
        templates = require('templates/templates'),
        LoaderElem = require('components/loader/loader');


    // code
    var FunnelView = BaseView.extend({
        template: templates['modules/funnel/funnel'],

        elementsUI: {
            'dashboardTitle': '[data-region=title]',
            'cohortSelect': '[data-action=select-cohort]',
            'saveFunnelBtn': '[data-action=save-funnel]',
            'exportFunnelBtn': '[data-action=export-funnel]',
            'createSegmentBtn': '[data-action=create-segment]',
            'goBackBtn': '[data-action=go-back]'
        },

        events: {
            'change @ui.cohortSelect': '_saveFunnel',
            'click @ui.saveFunnelBtn': '_saveFunnel',
            'click @ui.goBackBtn': '_goBack'
        },

        initialize: function (options) {
            var _this = this;

            function getParameterByName(name) {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
                    results = regex.exec(location.search);
                return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
            }

            var funnelId = getParameterByName('fid');

            /* jshint camelcase:false */
            _this.state.init({
                query: '',
                fid: funnelId
            });
            /* jshint camelcase:true */

            _this.dictionaryModel = new DictionaryModel();

            _this.funnelMetaModel = new FunnelMetaModel();
            _this.funnelMetaModel.set('id', funnelId);
            _this.funnelMetaModel.dictionary = _this.dictionaryModel;

            _this.funnelDataModel = new FunnelDataModel();
            _this.funnelDataModel.set('id', funnelId);
            _this.funnelDataModel.dictionary = _this.dictionaryModel;

            _this.listenTo(_this.dictionaryModel, 'sync', function () {
                _this.funnelMetaModel.fetch();
            });

            _this.listenTo(_this.funnelMetaModel, 'store', _this._saveFunnel);
            _this.listenTo(_this.funnelMetaModel, 'sync', _this.redraw);
            _this.listenTo(_this.funnelMetaModel, 'updated', _this.redraw);

            _this.listenTo(_this.state, 'change', function () {
                _this.funnelDataModel.fetch({data: _this.state.serialize()});
            });
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));
            _this.bindUI();

            var builder = new SequenceBuilder({
                dictionaryModel: _this.dictionaryModel,
                funnelMetaModel: _this.funnelMetaModel,
                state: _this.state
            });
            _this.region('sequence-builder').show(builder);

            var filterWidget = new FilterWidget({
                state: _this.state
            });
            _this.region('filter').show(filterWidget);

            var funnelWidget = new FunnelWidget({
                dictionaryModel: _this.dictionaryModel,
                funnelDataModel: _this.funnelDataModel,
                state: _this.state
            });
            _this.region('funnel').show(funnelWidget);

            var exportDialog = new ExportDialog({
                dictionaryModel: _this.dictionaryModel,
                funnelDataModel: _this.funnelDataModel,
                funnelMetaModel: _this.funnelMetaModel,
                state: _this.state
            });
            _this.region('export').show(exportDialog);

            var segmentDialog = new SegmentDialog({
                funnelMetaModel: _this.funnelMetaModel,
                state: _this.state
            });
            _this.region('create-segment').show(segmentDialog);

            _this.dictionaryModel.fetch();
        },

        redraw: function () {
            var _this = this;

            var name = _this.funnelMetaModel.get('data').name;
            var cohort = _this.funnelMetaModel.get('data').cohort;

            _this.ui.$dashboardTitle.val(name ? name : 'New Funnel');
            _this.ui.$cohortSelect.val(cohort ? cohort : '-1');

            _this.funnelDataModel.fetch({data: _this.state.serialize()});
        },

        _saveFunnel: function () {
            var _this = this;

            _this.funnelMetaModel.get('data').name = _this.ui.$dashboardTitle.val();
            _this.funnelMetaModel.get('data').cohort = _this.ui.$cohortSelect.val();

            _this.funnelMetaModel.save();
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

    var loader = new LoaderElem({
        root: body
    });
    loader.render();

    if (!RouterManager.start()) {
        var range = time.period(new Date(), 'last-day-7');

        var query = {'and': [
            {'date': {'gt': time.param(range[0])}},
            {'date': {'lt': time.param(range[1])}}
        ]};

        funnel.state.set('query', JSON.stringify(query), {silent: true});
    }

    return funnel;
});