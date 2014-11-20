"use strict";

var constants = require("./constants");
var debug = require("./debug");



exports.emptyFunction = function () {
};

/**
 * Selects a random element from a given list and returns it. It's possible to give a forbiddenElement
 * that won't be selected from the list.
 *
 * @param list
 * @param forbiddenElement
 * @returns {*}
 */
exports.selectRandomListElement = function (list, forbiddenElement) {
    var e = list.length;
    if(e === 0 || (e === 1 && list[0] === forbiddenElement)) throw new Error("IllegalArguments");

    var r = parseInt(Math.random() * e, 10);
    var selected = list[r];
    if (selected === forbiddenElement) selected = (r < e - 1 ? list[r + 1] : list[r - 1]);

    return selected;
};

// FROM: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
exports.getURLQueryParams = function (qs) {
    qs = qs.split("+").join(" ");

    var params = {};
    var tokens;
    var re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
};

/**
 * Calls a function lazy. This means the factory function fn will be called when the curried function (return value)
 * will be called the first time. The factory function needs to return the value that should be returned by the
 * curried function in future.
 *
 * @param fn
 * @returns {Function}
 */
exports.lazy = function (fn) {
    var value;
    return function () {
        if (typeof value === "undefined") value = fn();
        return value;
    };
};

/**
 * Repeats a given function **f** for **n** times.
 *
 * @param n
 * @param f
 * @returns {behaviorTree}
 */
exports.repeat = function (n, f) {
    for (var i = 0; i < n; i++) {
        f.call(this, i);
    }
    return this;
};

/**
 *
 * @param Clazz
 * @param size
 * @returns {Array}
 */
exports.createListByClass = function (Clazz, size) {
    var list = [];

    while (size > 0) {
        list.push(new Clazz());
        size--;
    }

    return list;
};

/**
 *
 */
exports.Matrix = exports.Structure({

    constructor: function (w, h, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;

        this.data = [];
        this.defValue = defaultValue;
        this.width = w;
        this.height = h;

        for (var i = 0; i < w; i++) {
            this.data[i] = [];
        }

        this.resetValues();
    },

    /**
     *
     */
    resetValues: function () {
        var defValue = this.defValue;
        var w = this.width;
        var h = this.height;
        var isFN = typeof defValue === 'function';

        for (var i = 0, e = w; i < e; i++) {
            for (var j = 0, ej = h; j < ej; j++) {
                this.data[i][j] = isFN ? defValue(i, j, this.data[i][j]) : defValue;
            }
        }
    },

    /**
     *
     * @param matrix
     */
    clone: function (matrix) {
        var w = this.width;
        var h = this.height;
        if (matrix.data.length !== this.data.length) throw Error();

        for (var i = 0, e = w; i < e; i++) {
            for (var j = 0, ej = h; j < ej; j++) {
                matrix.data[i][j] = this.data[i][j];
            }
        }
    }
});