"use strict";

var actions = require("../actions");

exports.action = {

  rating: function () {

    // use lowest possible rating here to make sure, that endTurn will be invoked at last
    return 1;
  },

  invoke: function () {
    actions.localAction("nextTurn");
  }
};