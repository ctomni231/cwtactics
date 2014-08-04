"use strict";

exports.action = {

  // use lowest possible rating here to make sure, that endTurn will be invoked at last
  rating: function () {
    return 1;
  },

  invoke: function () {

  }
}