"use strict";

var constants = require("./constants");
var debug = require("./debug");







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