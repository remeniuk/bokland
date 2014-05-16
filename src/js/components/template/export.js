/* global define */
define(function (require) {
    'use strict';

    // imports
    var $ = require('jquery'),
        _ = require('underscore'),
        config = require('config/api'),
        bootstrap = require('bootstrap'),
        BaseView = require('libs/view'),
        CubesModel = require('modules/dashboard/models/cubes'),
        templates = require('templates/templates');

    // code
    var View = BaseView.extend({
        exportUrl: function() {
            return config.server + (config.stubs ?
                'data.json' :
                'data/cube/' + this._selectedCube());
        },

        template: templates['components/template/exportdialog'],

        elementsUI: {
            'collection': '#collection',
            'maxRecords': '#max-records',
            'startFrom': '#start-from',
            'button': 'input'
        },

        events: {
            'click @ui.button': '_export'
        },

        initialize: function (options) {
            var _this = this;

            _this.state = options.state;

            _this.cubesModel = new CubesModel({});
            _this.cubesModel.fetch();

            _this.listenTo(_this.cubesModel, 'sync', _this.redraw);
        },

        render: function () {
            var _this = this;

            _this.$el.html(_this.template({}));

            _this.bindUI();

            return _this;
        },

        redraw: function () {
            var _this = this;

            var cubesOptions = _.map(_this.cubesModel.get('cubes'), function(cube) {
                return '<option id="' + cube.id + '">' + cube.name + '</option>';
            });

            _this.ui.$collection.empty().append(cubesOptions.join(''));

            return _this;
        },

        _selectedCube: function() {
            return this.ui.$collection.val();
        },

        _export: function (ev) {
            var _this = this;
            ev.preventDefault();

            var params = _.clone(_this.state.serialize());
            params.size = _this.ui.$maxRecords.val();
            params.offset = _this.ui.$startFrom.val();

            window.open(_this.exportUrl() + '?' + $.param(params));
        }

    });

    return View;
});