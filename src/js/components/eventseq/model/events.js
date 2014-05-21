/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        EventModel = require('components/eventseq/model/event'),
        Backbone   = require('backbone');


    // code
    var Model = Backbone.Collection.extend({
        model: EventModel
    });

    return Model;
});