/* global define */
define(function (require) {
    'use strict';

    // imports
    var _ = require('underscore'),
        config = require('config/api'),
        BaseModel = require('libs/model');


    // code
    var Model = BaseModel.extend({
        parametric: true,

        parse: function(resp) {
            var _this = this,
                data;

            if (resp.status) {
                _this._errors = resp.errors;
                data = resp.data;
            } else {
                data = resp;
            }

            data.id = (data._id || {}).$oid;

            return data;
        }
    });

    if(config.stubs){
        Model = Model.extend({ url: config.server + 'template-meta.json'});
    } else {
        Model = Model.extend({urlRoot: config.server + 'meta/dashboards/'});
    }

    return Model;
});