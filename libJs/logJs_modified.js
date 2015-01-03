/**
 * JavaScript logging framework with log levels.
 *
 * @version v0.0.1
 * @license Apache License, Version 2.0 http://www.apache.org/licenses/LICENSE-2.0.html
 * @author Alex Siman <aleksandr.siman@gmail.com>
 * @date 2013-11-04
 */

/*
NOTES:

Log levels (case insensitive) (by slf4j):
1) trace (the least serious)
2) debug
3) info
4) warn
5) error
6) fatal (the most serious)

Chrome console API: https://developers.google.com/chrome-developer-tools/docs/console-api
- Errors—Only show output from console.error()
- Warnings—Only show output from console.warn()
- Logs—Only show output from console.log(), console.info() and console.debug().
*/

/** Singleton */
var LogJS = new (function() {
    var self = this;

    // TODO: Cache loggers by name into map?

    self.api = {};

    return self;
})();

/** Singleton */
LogJS.api.Utils = new (function() {
    var self = this;

    self.getOrElse = function(obj, dft) {
        return typeof obj !== "undefined" ? obj : dft;
    };

    return self;
})();

/** Singleton */
LogJS.api.Config = new (function() {

    // TODO: Impl

//    self.defaultLevel = "debug";
//    self.dateTimePattern = "HH:mm:ss.SSS";
//    self.pattern = "{dateTime} {level} [{logger}] {msg}";
})();

/** Singleton */
LogJS.api.Level = new (function() {
    var self = this;

    var Utils = LogJS.api.Utils;

    // Do not add any other fields/functions to this object.
    // It is used as a hash map to find int representation of log level.
    self.ints = {
        all:    0, // log all levels
        trace: 10, // the least serious
        debug: 20, // default
        info:  30,
        warn:  40,
        error: 50,
        fatal: 60, // the most serious
        off:  999  // turn off logging
    };

    // Do not add any other fields/functions to this object.
    // It is used as a hash map to find string representation of log level.
    self.strs = {
        "10": "trace",
        "20": "debug",
        "30": "info",
        "40": "warn",
        "50": "error",
        "60": "fatal"
    };

    self.strsFixed = {
        "10": "TRACE",
        "20": "DEBUG",
        "30": "INFO ",
        "40": "WARN ",
        "50": "ERROR",
        "60": "FATAL"
    };

    self.defaultInt = self.ints.debug;
    self.defaultStr = self.strs[self.defaultInt];

    self.strToInt = function(slvl, idft) {
        var res;
        if (typeof slvl === "undefined" || slvl === null || slvl.trim() === "") {
            res = idft;
        } else {
            slvl = slvl.trim().toLowerCase();
            res = self.ints[slvl];
        }
        return Utils.getOrElse(res, self.defaultInt);
    };

    self.intToStr = function(ilvl) {
        var res = self.strs[ilvl];
        return Utils.getOrElse(res, self.defaultStr);
    };

    self.intToPrettyStr = function(ilvl) {
        return self.intToStr(ilvl).toUpperCase();
    };

    self.intToFixedStr = function(ilvl) {
        return self.strsFixed[ilvl];
    };

    return self;
})();

/** Singleton */
LogJS.api.LoggingFunction = new (function() {
    var self = this;

    var iLevel = LogJS.api.Level.ints;

    /** Hack to support a fallback to 'console.log' in old IE (< v10) for every other logging function. */
    var console = window.console || {};
    console.log = console.log || function() {};
    console.debug = console.debug || console.log;
    console.info = console.info || console.debug;
    console.warn = console.warn || console.info;
    console.error = console.error || console.warn;

    /** Get logging function by int level */
    self.apply = function(ilvl, msg) {
        if (ilvl === iLevel.trace) return console.debug(msg);
        if (ilvl === iLevel.debug) return console.debug(msg);
        if (ilvl === iLevel.info) return console.info(msg);
        if (ilvl === iLevel.warn) return console.warn(msg);
        if (ilvl === iLevel.error) return console.error(msg);
        if (ilvl === iLevel.fatal) return console.error(msg);
    };

    return self;
})();

/** Log class */
LogJS.api.Log = function Log(_opts) {
    var self = this;

    var Utils = LogJS.api.Utils;
    var Level = LogJS.api.Level;
    var iLevel = LogJS.api.Level.ints;

    var opts = _opts || {};
    var name = Utils.getOrElse(opts.name, self.constructor.name);
    var enabled = Utils.getOrElse(opts.enabled, true);
    var curILevel = Level.strToInt(opts.level);
    var timeStampCreator = null;

    // Log level can be passed as string or number.
//    var levelAny = getOrElse(opts.name, self.constructor.name);

    self.getName = function() {
        return name;
    };
    
    self.setTimeStampCreator = function (fn) {
    	if (typeof fn !== "function" && fn != null) {
    		throw new Error("Timestamp creator has to be a function");
    	}
    	timeStampCreator = fn;
	};

    /** @return {string} Current logging level. */
    self.getLevel = function() {
        return Level.intToPrettyStr(curILevel);
    };

    self.setLevel = function(slvl) {
        curILevel = Level.strToInt(slvl);
        return self;
    };

    /** @return {boolean} true if logging is enabled at any level. */
    self.isEnabled = function() {
        return enabled && curILevel < iLevel.off;
    };

    /** @return {boolean} true if logging is disabled at all. */
    self.isDisabled = function() {
        return !self.isEnabled();
    };

    self.setEnabled = function(bool) {
        enabled = bool;
        return self;
    };

    /**
     * Enable logging and return this log.
     * @return {LogJS.api.Log}
     */
    self.enable = function() {
        self.setEnabled(true);
        return self;
    };

    /**
     * Disable logging and return this log.
     * @return {LogJS.api.Log}
     */
    self.disable = function() {
        self.setEnabled(false);
        return self;
    };

    /**
     * @param ilvl {number}
     * @param msg {string|function}
     * @param err {object|function}
     */
    function logAtLevel(ilvl, _msg, _err) {
        var msgType = typeof _msg;
        var msg = null;
        if (msgType === "undefined" || _msg === null) {
            throw new Error("Logging message was not specified");
        } else if (msgType === "string") {
            msg = _msg;
        } else if (msgType === "function") {
            msg = _msg();
        } else if (msgType === "object") {
            msg = JSON.stringfy(_msg);
        } else {
            msg = "" + _msg;
        }

        var cDate = new Date();
        var dateTime = timeStampCreator != null? timeStampCreator(cDate) : cDate.toLocaleString();
        var fixedLevel = Level.intToFixedStr(ilvl);

        // TODO: Use patterns from config.
        var fullMsg = dateTime + " " + fixedLevel + " [" + name + "] " + msg;
        LogJS.api.LoggingFunction.apply(ilvl, fullMsg);

        var errType = typeof _err;
        if (errType === "object") {
            throw _err;
        } else if (errType === "function") {
            throw _err();
        }
    }

    self.trace = function(msg, err) {
        if (self.isTraceEnabled()) {
            logAtLevel(iLevel.trace, msg, err);
        }
    };

    self.debug = function(msg, err) {
        if (self.isDebugEnabled()) {
            logAtLevel(iLevel.debug, msg, err);
        }
    };

    self.info = function(msg, err) {
        if (self.isInfoEnabled()) {
            logAtLevel(iLevel.info, msg, err);
        }
    };

    self.warn = function(msg, err) {
        if (self.isWarnEnabled()) {
            logAtLevel(iLevel.warn, msg, err);
        }
    };

    self.error = function(msg, err) {
        if (self.isErrorEnabled()) {
            logAtLevel(iLevel.error, msg, err);
        }
    };

    self.fatal = function(msg, err) {
        if (self.isFatalEnabled()) {
            logAtLevel(iLevel.fatal, msg, err);
        }
    };

    /** @return {boolean} Is trace logging currently enabled? */
    self.isTraceEnabled = function() {
        return enabled && curILevel <= iLevel.trace;
    };

    /** @return {boolean} Is debug logging currently enabled? */
    self.isDebugEnabled = function() {
        return enabled && curILevel <= iLevel.debug;
    };

    /** @return {boolean} Is info logging currently enabled? */
    self.isInfoEnabled = function() {
        return enabled && curILevel <= iLevel.info;
    };

    /** @return {boolean} Is warn logging currently enabled? */
    self.isWarnEnabled = function() {
        return enabled && curILevel <= iLevel.warn;
    };

    /** @return {boolean} Is error logging currently enabled? */
    self.isErrorEnabled = function() {
        return enabled && curILevel <= iLevel.error;
    };

    /** @return {boolean} Is fatal logging currently enabled? */
    self.isFatalEnabled = function() {
        return enabled && curILevel <= iLevel.fatal;
    };

    return self;
};

LogJS.get = function(opts) {
    return new LogJS.api.Log(opts);
};

/** Default log */
LogJS.root = LogJS.get({name: "Log.js"});