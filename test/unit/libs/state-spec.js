/* global define, jasmine, beforeEach, afterEach, describe, it, xdescribe, xit, spyOn, expect */
define(function(require) {
    'use strict';

    // imports
    var Backbone   = require('backbone'),
        StateModel = require('libs/state');


    // code
    describe('tests of "libs/state".', function() {
        it('should be a Backbone Model', function() {
            var state = new StateModel();
            expect(state instanceof Backbone.Model).toBe(true);
        });
    });


    describe('tests of "libs/state" trigger events "change".', function() {
        var state,
            listnerSpy;

        beforeEach(function() {
            state = new StateModel();
            listnerSpy = jasmine.createSpy('listnerSpy');
        });

        it('should initialize without triggering events "change"', function() {
            state.on('change', listnerSpy);

            state.init('_', []);
            state.init({
                opt: {
                    def: 1
                },
                filters: []
            });

            expect(listnerSpy.calls.count()).toBe(0);
        });

        it('should initialize deep models without triggering events "change"', function() {
            state.on('change', listnerSpy);

            var ref = state.init('sub', {}).ref('sub');

            ref.init('_', []);
            ref.init({
                opt: {
                    def: 1
                },
                filters: []
            });

            expect(listnerSpy.calls.count()).toBe(0);
        });
    });

    return null;
});