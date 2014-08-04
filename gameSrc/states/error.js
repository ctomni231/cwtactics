"use strict";

var activeCmd = 0;
var rendered = false;
var message = null;
var where = null;

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

  render: function (delta) {
    if (!rendered) {
      var ctxUI = cwt.Screen.layerUI.getContext();
      rendered = true;
    }
  }
};