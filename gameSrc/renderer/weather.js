"use strict";

var constants = require("../constants");

//Since the time is so low I probably don't need to track it.
//But it seems memory intensive to pull off, there has to be
//a less expensive way

//Keeps track of the frequency of a raindrop
var FREQUENCY = 1;

//Maximum frame wait per particle
var MAX = 8;

//Keeps track of the time
var time;

//Keeps track of delta time
var store;

//Keeps track of the cap
var cap;

//The type of raindrop/snow flake to draw
var type;

//The x-axis position of the raindrop/snow flake
var posx;

//The y-axis position of the raindrop/snow flake
var posy;

var activeGraphic;

var ball;

//Holds the graphics for a simple raindrop (cache). Totally hard coded all the values here
var raindropGfx = document.createElement('canvas');
ball.width = 10;
ball.height = 10;

var raindropCtx = raindropGfx.getContext('2d');
raindropCtx.strokeStyle = "rgba(255,255,255,0.3)";
raindropCtx.lineWidth = 1;
raindropCtx.beginPath();
raindropCtx.moveTo(0, 0);
raindropCtx.lineTo(4, 10);
raindropCtx.stroke();

exports.setWeather = function(weather) {
  time = 0;
  store = 0;
  cap = 50;
  type = [];
  posx = [];
  posy = [];
};

exports.update = function(delta) {

};

exports.render = function(layer) {
  var ctx = layer.getContext();

  //Tests the speed of each particle for debug mode
  if (constants.DEBUG) {
    time = (new Date()).getTime();
  }

  //Render particles
  for (var i = 0; i < type.length; i++) {
    if (type[i] == -1)
      continue;

    ctx.drawImage(activeGraphic, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
  }

  //Finishes the testing of speed for snow particles
  if (constants.DEBUG) {
    console.log("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
  }
};
