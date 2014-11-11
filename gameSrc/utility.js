"use strict";

var debug = require("./debug");

var xmlHttpReq;

try {
    new XMLHttpRequest();
    xmlHttpReq = true;
} catch (ex) {
    xmlHttpReq = false;
}

function reqListener() {
    if (this.readyState == 4) {
        // FINE
        if (this.readyState == 4 && this.status == 200) {
            console.log("grabbed file successfully");

            // JSON OBJECT
            if (this.asJSON) {
                var arg;
                try {
                    arg = JSON.parse(this.responseText);
                }
                    // FAILED TO CONVERT JSON TEXT
                catch (e) {
                    this.failCallback(e);
                }
                this.winCallback(arg);
            }
            // PLAIN TEXT
            else {
                this.winCallback(this.responseText);
            }
        }
        // ERROR
        else {
            console.log("could not grab file");
            this.failCallback(this.statusText);
        }
    }
}

exports.doHttpRequest = function (options) {
    var oReq;

    debug.logInfo("try to grab file " + options.path);

    // GENERATE REQUEST OBJECT
    if (xmlHttpReq) oReq = new XMLHttpRequest();
    else oReq = new ActiveXObject("Microsoft.XMLHTTP");

    // WIN / FAIL CALLBACK
    oReq.asJSON = options.json;
    oReq.winCallback = options.success;
    oReq.failCallback = options.error;

    // META DATA
    oReq.onreadystatechange = reqListener;
    oReq.open("get", options.path + "?_cwtR=" + parseInt(10000 * Math.random(), 10), true);

    // SEND IT
    oReq.send();
};

exports.Structure = function (superClass, implementation) {
    var mainClass = implementation.constructor || function () {};
    mainClass.prototype = superClass ? Object.create(superClass) : {};

    var objects;
    if (implementation.STATIC) {
        objects = Object.keys(implementation.STATIC);
        for (var i = 0, e = objects.length; i < e; i++) {
            mainClass[objects[i]] = implementation.STATIC[objects[i]];
        }
        delete implementation.STATIC;
    }

    objects = Object.keys(implementation);
    for (var i = 0, e = objects.length; i < e; i++) {
        mainClass.prototype[objects[i]] = implementation[objects[i]];
    }

    return mainClass;
};

/**
 * Calls functions in a sequence. The execution of the functions will be stopped when one of the functions
 * throws an error.
 *
 * @param functionList list of functions that will be called in a sequence
 * @param callback callback that will be called after every function in the list has been called
 * @return {*}
 */
exports.sequence = function (functionList, callback) {
    if (functionList.length === 0) {
        throw new Error("IllegalArgumentException: function list cannot be empty");
    }

    var completed = 0;

    /**
     * Evaluates the current (completed acts as pointer) function in the function list
     */
    var iterate = function (nextCallback) {
        functionList[completed](nextCallback);
    };

    var callbackFunction = function () {
        completed++;
        if (completed === functionList.length) {
            if (callback) {
                callback();
            }
        } else {
            iterate(callbackFunction);
        }
    };

    iterate();
};

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
 * @returns {exports}
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