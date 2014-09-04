"use strict";

var renderer = require("../renderer");

var activeCmd = 0;
var rendered = false;
var message = null;
var where = null;

exports.setErrorData = function (errorMessage, errorWhere) {
  message = errorMessage;
  where = errorWhere;
  rendered = false;
};

// TODO use button group here instead of this direct hacky stuff

exports.state = {
  id: "ERROR_SCREEN",

  enter: function () {
    rendered = false;
    activeCmd = 0;
    message = null;
    where = null;
  },

  update: function (delta, lastInput) {
    switch (lastInput) {

      case this.input.TYPE_LEFT:
        if (activeCmd > 0) activeCmd--;
        break;

      case this.input.TYPE_RIGHT:
        if (activeCmd < 2) activeCmd++;
        break;

      case this.input.TYPE_ACTION :
        switch (activeCmd) {

          /* Restart */
          case 0: break;

          /* Wipe-Out Content and restart*/
          case 1: break;

          /* Send report and restart */
          case 2: break;
        }
        break;
    }
  },

  render: function () {
    if (!rendered) {
      var ctxUI = renderer.layerUI.getContext();

      rendered = true;
    }
  }
};