/* global define */
define(function(require) {
    'use strict';

    // imports
    var d3 = require('d3'),
        DATE_RANGE_DELIMITER = '-',
        CURRENT_MODE = 'current',
        RELATIVE_MODE = 'last';


    // code
    function _today() {
        return d3.time.day.floor(new Date());
    }

    function _period(inputDate, attr) {
        var params,
            mode,
            period,
            count;

        params = attr.split(DATE_RANGE_DELIMITER);

        mode = params[0] || null;
        period = params[1] || null;
        count = params[2] || 1;

        var finish = inputDate || new Date(),
            seconds = finish.getSeconds(),
            minutes = finish.getMinutes(),
            hours = finish.getHours(),
            day = finish.getDay(),
            date = finish.getDate(),
            month = finish.getMonth(),
            year = finish.getFullYear(),
            start = new Date(finish);

        if (mode === CURRENT_MODE) {
            count = count > 1 ? count - 1 : 0;
            switch (period) {
                case 'minute':
                    start = new Date(year, month, date, hours, minutes - count, 0, 0);
                    break;
                case 'hour':
                    start = new Date(year, month, date, hours - count, 0, 0, 0);
                    break;
                case 'day':
                    start = new Date(year, month, date - count - 1, 0, 0, 0, 0);
                    break;
                case 'week':
                    var dif = (start.getDay() + 6) % 7;
                    start.setDate(date - count * 7);
                    start = new Date(start - dif * 24 * 60 * 60 * 1000);
                    start = new Date(
                        start.getFullYear(),
                        start.getMonth(),
                        start.getDate() - 1,
                        0,
                        0,
                        0,
                        0
                    );
                    break;
                case 'month':
                    start = new Date(year, month - count, 0, 0, 0, 0, 0);
                    break;
                case 'year':
                    start = new Date(year - count, 0, 0, 0, 0, 0, 0);
                    break;
            }
        } else if (mode === RELATIVE_MODE) {
            switch (period) {
                case 'minute':
                    start.setMinutes(minutes - count);
                    break;
                case 'hour':
                    start.setHours(hours - count);
                    break;
                case 'day':
                    start.setDate(date - count);
                    break;
                case 'week':
                    start.setDate(date - count * 7);
                    break;
                case 'month':
                    start.setMonth(month - count);
                    break;
                case 'year':
                    start.setFullYear(year - count);
                    break;
            }
        } else {
            return false;
        }

        return [start, finish];
    }

    function _param(time) {
        var format = d3.time.format('%Y-%m-%d');
        return format(time);
    }

    function _deparam(time) {
        var format = d3.time.format('%Y-%m-%d');
        return format.parse(time);
    }

    return {
        today: _today,
        period: _period,
        param: _param,
        deparam: _deparam
    };
});