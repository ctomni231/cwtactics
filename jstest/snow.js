"use strict";

// weather.js
//
// A simple class that does the snow particle demo in JS
//
// @author = Carr, Crecen
// @version = 04.30.14
//
//First attempt at creating the snow weather for JavaScript
//It turned out to be a chore to draw circles, but I think
//I figured it out...

//Since the time is so low I probably don't need to track it.
//But it seems memory intensive to pull off, there has to be
//a less expensive way

var renderer = require("../renderer");
var constants = require("../constants");
var stm = require("../statemachine");
var input = require("../input");

//Keeps track of the time
var time = 0;
//Keeps track of delta time
var store = 0;
//Maximum frame wait per particle
var MAX = 32;
//Keeps track of the cap
var cap = 50;
//Keeps track of the frequency of a snowball
var FREQUENCY = 2;

//The type of snowball to draw
var type = [];
//The x-axis position of the snowball
var posx = [];
//The y-axis position of the snowball
var posy = [];

//Holds the graphics for a simple snowball (cache)
//Totally hard coded all the values here
var ball = document.createElement('canvas');
ball.width = 10;
ball.height = 10;

var ctx = ball.getContext('2d');
ctx.strokeStyle = "rgba(255,255,255,0.3)";
ctx.lineWidth = 4;
ctx.beginPath();
ctx.arc(5, 5, 2, 0, Math.PI * 2);
ctx.stroke();

exports.state = {
  id: "WEATHER",
  last: "MAIN_MENU",

  enter: function () {
    //Clears the UI layer for demo
    renderer.layerUI.clear();
  },

  update: function (delta, lastInput) {

    // action leads into main menu (Thanks BlackCat
    if (lastInput && lastInput.key === input.TYPE_ACTION)
      this.changeState("MAIN_MENU");

    //Particle creation (totally fixed up to take as little memory as possible)
    for (var i = 0; i < type.length + 1; i++) {
      //This one liner prevents massive amount of particles
      if (i == cap)
        break;
      if (parseInt(Math.random() * FREQUENCY) == 1) {
        if (i == type.length) {
          type.push(parseInt(Math.random() * 3));
          posx.push(((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200);
          posy.push(-10);
          break;
        }
        if (type[i] == -1) {
          type[i] = parseInt(Math.random() * 3);
          posx[i] = ((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200;
          posy[i] = -10;
          break;
        }

      }
    }

    if (constants.DEBUG) {
      console.log("Quick render of snow... Delta is " + delta);
    }

    var dis = parseInt((250 / 1000) * delta, 10);
    var disQuart = parseInt(dis / 4, 10) || 1;

    // var store += delta;
    //while(var store > var MAX){
    //Snow particle updates
    for (var i = 0; i < type.length; i++) {
      if (type[i] == -1)
        continue;

      if (type[i] == 2) {
        posx[i] += disQuart;
      }
      posx[i] += disQuart;
      posy[i] += dis;

      //Destroy particles
      if (posy[i] > renderer.screenHeight + 10)
        type[i] = -1;
    }
    // var store -= var MAX;
    //}
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
      console.log("Quick render of snow... needed " + ((new Date()).getTime() - time) + "ms");
    }
  }
};