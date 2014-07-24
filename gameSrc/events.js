"use strict";

var events = {};

var EventChannel = my.Class({

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

  broadcast: function () {
    for (var i = 0, e = this.callbacks.length; i < e; i++) {
      this.callbacks[i].apply(null, arguments);
    }
  }
});

exports.event = function (event) {
  "use strict";

  if (!events.hasOwnProperty(event)) {
    events[event] = new EventChannel();
  }

  return events[event];
};