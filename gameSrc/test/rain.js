"use strict";

// rain.js
//
// A simple class that does the rain demo in JS
//
// @author = Carr, Crecen
// @version = 04.30.14
//
//First attempt at creating the rain weather for JavaScript

var renderer = require("../renderer");
var constants = require("../constants");
var stm = require("../statemachine");
var input = require("../input");

//Since the time is so low I probably don't need to track it.
//But it seems memory intensive to pull off, there has to be
//a less expensive way

//Keeps track of the time
var time = 0;
//Keeps track of delta time
var store = 0;
//Maximum frame wait per particle
var MAX = 8;

//Keeps track of the cap
var cap = 50;
//Keeps track of the frequency of a raindrop
var FREQUENCY = 1;

//The type of raindrop to draw
var type = [];
//The x-axis position of the raindrop
var posx = [];
//The y-axis position of the raindrop
var posy = [];

//Holds the graphics for a simple raindrop (cache)
//Totally hard coded all the values here
var ball = document.createElement('canvas');
ball.width = 10;
ball.height = 10;

var ctx = ball.getContext('2d');
ctx.strokeStyle = "rgba(255,255,255,0.3)";
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(4, 10);
ctx.stroke();

exports.state = {
  id: "RAIN",
  last: "MAIN_MENU",

  enter: function () {
    //Clears the UI layer for demo
    renderer.layerUI.clear();
  },

  update: function (delta, lastInput) {

    // action leads into main menu (Thanks BlackCat
    if (lastInput && lastInput.key === input.TYPE_ACTION)
      this.changeState("MAIN_MENU");

    store += delta;
    while (store > MAX) {
      //Particle creation (totally fixed up to take as little memory as possible)
      for (var i = 0; i < type.length + 1; i++) {
        //This one liner prevents massive amount of particles
        if (i == cap)
          break;
        if (parseInt(Math.random() * FREQUENCY) == 0) {
          if (i == type.length) {
            type.push(parseInt(Math.random() * 2));
            posx.push(((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200);
            posy.push(-10);
            break;
          }
          if (type[i] == -1) {
            type[i] = parseInt(Math.random() * 2);
            posx[i] = ((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200;
            posy[i] = -10;
            break;
          }

        }
      }

      //Rain particle updates
      for (var i = 0; i < type.length; i++) {
        if (type[i] == -1)
          continue;

        posx[i] += 1;
        posy[i] += 4;

        //Destroy particles
        if (posy[i] > renderer.screenHeight + 10)
          type[i] = -1;
      }
      store -= MAX;
    }
  },

  render: function () {
    var ctx = renderer.layerUI.getContext();

    //Tests the speed of each particle for debug mode
    if (constants.DEBUG) {
      time = (new Date()).getTime();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);

    //Render particles
    for (var i = 0; i < type.length; i++) {
      if (type[i] == -1)
        continue;

      ctx.drawImage(ball, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
    }

    //Finishes the testing of speed for snow particles
    if (constants.DEBUG) {
      console.log("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
    }
  }
};