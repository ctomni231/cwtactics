"use strict";

// some variables to realize a simple loading bar (no class because we have only one instance
// of a loading bar in the game)

var constants = require("../constants");

var x = 10;
var y = 0;
var width = 0;
var height = 20;
var process = 0;
var done = false;

exports.state = {
  id: "LOADING_SCREEN",

  init: function () {
    y = parseInt(this.renderer.screenHeight / 2, 10) - 10;
    width = this.renderer.screenWidth - 20;
  },

  enter: function () {
    require("../loading").startProcess(
      function (p) {
        process = p;
      },
      function () {
        process = 100;
      }
    );
  },

  update: function () {
    if (done) {
      this.changeState("START_SCREEN");
    } else if (process === 100) {
      done = true;
    }
  },

  render: function () {
    var ctx = this.renderer.layerUI.getContext(constants.INACTIVE);

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, (parseInt(width * (process / 100), 10)), height);
  }
};