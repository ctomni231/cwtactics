"use strict";

var events = {};

exports.EventChannel = my.Class({

  constructor: function () {
    this.callbacks = [];
  },

  subscribe: function (callback) {
    this.callbacks.push(callback);
  },

  unsubscribe: function (callback) {
    var index = this.callbacks.indexOf(callback);
    if (index == -1) {
      return;
    }

    this.callbacks.splice(index, 1);
  },

  unsubscribeAll: function () {
    this.callbacks.splice(0);
  },

  broadcast: function () {
    for (var i = 0, e = this.callbacks.length; i < e; i++) {
      this.callbacks[i].apply(null, arguments);
    }
  }
});

// Returns an **EventChannel** object for a given **event** name.
//
exports.event = function (event) {

  if (!events.hasOwnProperty(event)) {
    events[event] = new exports.EventChannel();
  }

  return events[event];
};

// Removes an **EventChannel** object with a given **event** name. All handlers will be released.
//
exports.removeEvent = function (event) {
  if (!events.hasOwnProperty(event)) {
    events[event].unsubscribeAll();
    events[event] = null;
  }
};