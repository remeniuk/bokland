/* global define */
define(function(require) {
    'use strict';

    // imports
    var _        = require('underscore'),
        d3       = require('d3'),
        BaseView = require('libs/view');

    // code
    var __super__ = BaseView.prototype;
    var View = BaseView.extend({
        elementsUI: {
            'bar': '.rowchart__bar'
        },

        events: {
            'mouseover @ui.bar': '_highlight',
            'mouseout @ui.bar': '_unhighlight',
            'click @ui.bar': '_filter'
        },

        initialize: function(options) {
            var _this = this;

            _this.options = _.extend(_this.defaults(), options || {});
            _this.storage = {};
            _this.ui = {};
            _this.cache = {};

            _this.rendered = false;
        },

        defaults: function() {
            var options = {};

            options.margin = {top: 30, right: 10, bottom: 30, left: 30};

            options.bar = 20;
            options.step = 0.15;
            options.factor = 1.25;

            options.width = 100;
            options.height = options.bar;

            options.duration = 500;

            options.format = d3.format(',.0f');

            options.scaleX = d3.scale.linear().range([0, options.width]);
            options.scaleY = d3.scale.ordinal().rangeRoundBands([0, options.height], options.step);

            options.axisX = d3.svg.axis().scale(options.scaleX).orient('top').ticks(5).tickSize(5);
            options.axisY = d3.svg.axis().scale(options.scaleY).orient('left').tickSize(0);

            options.max = -1;

            return options;
        },

        render: function() {
            var _this = this,
                options = _this.options,
                ui = _this.ui;

            ui.svg = d3.select(_this.el).append('svg')
                .attr('class', 'rowchart')
                .attr('width', options.width + options.margin.left + options.margin.right)
                .attr('height', options.height + options.margin.top + options.margin.bottom);

            ui.g = ui.svg.append('g')
                .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

            ui.container = ui.g.append('g')
                .attr('class', 'rowchart__container')
                .attr('transform', 'translate(1,1)');

            ui.axisX = ui.g.append('g')
                .attr('class', 'rowchart__axis rowchart__axis-x')
                .call(options.axisX);

            ui.axisY = ui.g.append('g')
                .attr('class', 'rowchart__axis rowchart__axis-y')
                .call(options.axisY);

            _this.rendered = true;

            return _this.redraw();
        },

        redraw: function() {
            var _this = this,
                options = _this.options,
                ui = _this.ui,
                data = _this.data(),
                x = options.scaleX,
                y = options.scaleY;

            if (!_this.rendered) {
                return _this;
            }

            // resize chart if need
            _this.resize();

            // set the scale domain.
            x.domain([0, d3.max(data, function(d) { return d.value; }) * options.factor]).nice();
            y.domain(data.map(function(d) { return d.name; }));

            // render bars
            var bars, bar;

            bars = ui.container.selectAll('g.rowchart__bar')
                .data(data, function(d) { return d.name; });

            // create new bars
            bar = bars.enter().append('g')
                .attr('class', 'rowchart__bar')
                .attr('transform', 'translate(0,0)')
                .attr('data-id', function(d) { return d.id; })
                .classed('rowchart__bar--active', function(d) { return _this.filtered(d.id); });

            bar.append('rect')
                .attr('width', function(d) { return x(d.value); })
                .attr('height', y.rangeBand());

            bar.append('text')
                .attr('class', 'rowchart__bar__value')
                .attr('x', function(d) { return x(d.value); })
                .attr('y', y.rangeBand() / 2)
                .attr('dx', 3)
                .attr('dy', '.35em')
                .attr('text-anchor', 'begin')
                .text(function(d) { return options.format(d.value); });

            bar.transition().duration(options.duration)
                .attr('transform', function(d) { return 'translate(0,' + y(d.name) + ')'; });

            // update exists bars
            bar = bars
                .classed('rowchart__bar--active', function(d) { return _this.filtered(d.id); })
                .transition().duration(options.duration)
                .attr('transform', function(d) { return 'translate(0,' + y(d.name) + ')'; });

            bar.select('rect')
                .attr('width', function(d) { return x(d.value); })
                .attr('height', y.rangeBand());

            bar.select('text')
                .attr('x', function(d) { return x(d.value); })
                .attr('y', y.rangeBand() / 2)
                .text(function(d) { return options.format(d.value); });

            // remove old bars
            bars.exit()
                .transition().duration(options.duration)
                .attr('fill-opacity', 0)
                .remove();


            // update axis
            ui.axisX
                .transition().duration(options.duration)
                .call(options.axisX);

            ui.axisY
                .transition().duration(options.duration)
                .call(options.axisY);

            return _this;
        },

        resize: function() {
            var _this = this,
                options = _this.options,
                cache = _this.cache,
                ui = _this.ui;

            if (!_this.rendered) {
                return _this;
            }

            // update width
            options.width = Math.round(_this.$el.innerWidth() - options.margin.left - options.margin.right);

            if (options.bar) {
                // auto resize by height
                var count = _this.data().length || 1;
                options.height = count * options.bar;
            }

            if (options.height !== cache.height || options.width !== cache.width) {
                options.scaleX.range([0, options.width]);
                options.scaleY.rangeRoundBands([0, options.height], options.step);

                options.axisX.scale(options.scaleX).orient('top').ticks(5).tickSize(5);
                options.axisY.scale(options.scaleY).orient('left').tickSize(0);

                ui.svg.attr('width', options.width + options.margin.left + options.margin.right)
                    .attr('height', options.height + options.margin.top + options.margin.bottom);

                ui.g.attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

                cache.width = options.width;
                cache.height = options.height;
            }

            return _this;
        },


        data: function(data, options) {
            var _this = this,
                storage = _this.storage;

            options || (options = {});

            // get data
            if (arguments.length === 0) {
                return storage.data || [];
            }

            // set data
            data = data.map(function(d) {
                return {
                    id: d.id || d.name,
                    name: d.name,
                    value: Number(d.value)
                };
            });
            data.sort(function(a, b) { return b.value - a.value; });

            if (_this.options.max > 0 && data.length > _this.options.max) {
                data.length = _this.options.max;    // get top '_this.options.max' results
            }

            storage.data = data;

            if (options.redraw !== false) {
                return _this.redraw();
            }

            return _this;
        },

        filter: function(filter, options) {
            var _this = this,
                storage = _this.storage;

            filter || (filter = []);
            options || (options = {});

            // get filter
            if (arguments.length === 0) {
                return _.clone(storage.filter || []);
            }

            // set filter
            if (!_.isEqual(storage.filter, filter)) {
                storage.filter = filter;
                storage.filterMap = _.object(filter, _.range(1, filter.length + 1));

                if (!options.silent) {
                    _this.trigger('filter', _this, filter);
                }
            }

            if (options.redraw !== false) {
                return _this.redraw();
            }

            return _this;
        },

        filtered: function(id) {
            var _this = this,
                map = _this.storage.filterMap || {};

            return !!map[id];
        },


        _highlight: function(e) {
            d3.select(e.currentTarget).classed('rowchart__bar--highlight', true);
        },

        _unhighlight: function(e) {
            d3.select(e.currentTarget).classed('rowchart__bar--highlight', false);
        },

        _filter: function(e) {
            var _this = this,
                filter = _this.filter(),
                id = d3.select(e.currentTarget).attr('data-id');

            /* jshint eqeqeq:false */
            if (id == Number(id)) {
                id = Number(id);        // convert string to number ('1' to 1)
            }
            /* jshint eqeqeq:true */

            if (_this.filtered(id)) {
                filter = _.without(filter, id);
            } else {
                filter.push(id);
            }

            _this.filter(filter);

            e.preventDefault();
        }
    });

    return View;
});