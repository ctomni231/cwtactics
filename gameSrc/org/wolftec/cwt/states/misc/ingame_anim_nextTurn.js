"use strict";

var constants = require("../constants");
var renderer = require("../renderer");
var model = require("../model");

var MIDDLE_WAIT_TIME = 500;
var MOVE_PER_MS = parseInt((1 * constants.TILE_BASE) / 1000, 10);
if (MOVE_PER_MS === 0) MOVE_PER_MS = 1;

var BAR_MOVE_PER_MS = MOVE_PER_MS * 4;

var text;
var curX;
var curY;
var curBarX;
var middleX;
var waited;
var inMiddle;

exports.state = {
  id: "ANIMATION_NEXT_TURN",
  nextState: "INGAME_IDLE",

  states: 5,

  enter: function() {
    text = "Day " + model.day;
    curY = 0;
    curBarX = 0;
    curX = 1;
    waited = 0;
    inMiddle = false;

    var ctx = renderer.layerUI.getContext();

    ctx.font = "64pt " + constants.GAME_FONT;

    middleX = parseInt(renderer.screenWidth / 2, 10) - parseInt(ctx.measureText(text).width / 2, 10);
    curY = parseInt(renderer.screenHeight / 2, 10) + 32;

    // TODO play music
    //if (controller.features_client.audioMusic) {
    //	var commanders = model.co_data[model.round_turnOwner].coA;
    //	controller.coMusic_playCoMusic((commanders) ? commanders.music : null);
    //}
  },

  exit: function () {
    renderer.layerUI.clear();
  },

  update: function(delta, lastInput, state) {
    switch(state) {

      // FLY IN BAR
      case 0:
        var factor = curBarX/renderer.screenWidth;
        var move = parseInt(BAR_MOVE_PER_MS * delta * factor, 10);
        if (move <= 0) move = 1;

        curBarX += move;

        return (curBarX > renderer.screenWidth);

      // FLY IN TEXT
      case 1:
        var factor = 1 - (curX/middleX);

        console.log("factor: "+factor);

        var move = parseInt(MOVE_PER_MS * delta * factor, 10);
        if (move <= 0) move = 1;

        curX += move;

        return (curX >= middleX);

      // WAIT IN THE MIDDLE
      case 2:
        waited += delta;

        // go further when you waited a but in the middle of the screen
        return (waited >= MIDDLE_WAIT_TIME);

      // FLY OUT TEXT
      case 3:
        var factor = (curX-middleX)/middleX;
        var move = parseInt(MOVE_PER_MS * delta * factor, 10);
        if (move <= 0) move = 1;

        curX += move;

        return (curX > renderer.screenWidth + 10);

      // FLY OUT BAR
      case 4:
        var factor = curBarX/renderer.screenWidth;
        var move = parseInt(BAR_MOVE_PER_MS * delta * factor, 10);
        if (move <= 0) move = 1;

        curBarX -= move;

        if (curBarX <= 0) {
          curBarX = 0;
          return true;
        }
        return false;
    }    
  },

  render: function() {
    renderer.layerUI.clear();
    var ctx = renderer.layerUI.getContext();

    ctx.lineWidth = 4;

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, curY+5, curBarX, 2);

    ctx.fillStyle = "rgb(100,100,100)";
    ctx.fillRect(0, curY+7, curBarX, 1);

    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fillRect(0, curY+8, curBarX, 1);

    if (curX > 1){
      ctx.font = "64pt " + constants.GAME_FONT;

      ctx.fillStyle = "rgb(255,255,255)";
      ctx.fillText(text, curX, curY);

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.strokeText(text, curX, curY);
    }
    
    ctx.lineWidth = 1;
  }
};