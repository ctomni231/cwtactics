package net.wolfTec.cwt.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.model.WeatherType;
import net.wolfTec.wtEngine.renderer.AnimatedLayer;
import net.wolfTec.wtEngine.renderer.Layer;
import net.wolfTec.wtEngine.renderer.ScreenLayer;

import org.stjs.javascript.Array;
import org.stjs.javascript.Date;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.InjectedByFactory;

@Bean public class EffectsLayerBean extends ScreenLayer implements AnimatedLayer {

  @InjectedByFactory private Logger log;

  private int time;
  private int store;
  private int cap;
  private Array<Integer> type;
  private Array<Integer> posx;
  private Array<Integer> posy;

  @Override public int getZIndex() {
    return 5;
  }
  
  @Override public int getSubStates() {
    return 1;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Effects";
  }
  
  /* Since the time is so low I probably don't need to track it. But it seems memory intensive to pull off,
   * there has to be a less expensive way */
  public void initWeather() {

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


  }
  
  public void setWeatherType(WeatherType weather) {
    time = 0;
    store = 0;
    cap = 50;
    type = JSCollections.$array();
    posx = JSCollections.$array();
    posy = JSCollections.$array();
  }

  public void updateWeather(int delta) {

  }

  public void renderWeather() {
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);

    // Tests the speed of each particle for debug mode
    time = (int) new Date().getTime();

    // Render particles
    for (int i = 0; i < type.$length(); i++) {
      if (type.$get(i) == -1) {
        continue;
      }

      ctx.drawImage(activeGraphic, posx.$get(i), posy.$get(i), 10 + 5 * type.$get(i), 10 + 5 * type.$get(i));
    }

    // Tests the speed of each particle for debug mode
    log.info("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
  }
}

//"use strict";
//
////weather.js
////
////A simple class that does the snow particle demo in JS
////
////@author = Carr, Crecen
////@version = 04.30.14
////
////First attempt at creating the snow weather for JavaScript
////It turned out to be a chore to draw circles, but I think
////I figured it out...
//
////Since the time is so low I probably don't need to track it.
////But it seems memory intensive to pull off, there has to be
////a less expensive way
//
//var renderer = require("../renderer");
//var constants = require("../constants");
//var stm = require("../statemachine");
//var input = require("../input");
//
////Keeps track of the time
//var time = 0;
////Keeps track of delta time
//var store = 0;
////Maximum frame wait per particle
//var MAX = 32;
////Keeps track of the cap
//var cap = 50;
////Keeps track of the frequency of a snowball
//var FREQUENCY = 2;
//
////The type of snowball to draw
//var type = [];
////The x-axis position of the snowball
//var posx = [];
////The y-axis position of the snowball
//var posy = [];
//
////Holds the graphics for a simple snowball (cache)
////Totally hard coded all the values here
//var ball = document.createElement('canvas');
//ball.width = 10;
//ball.height = 10;
//
//var ctx = ball.getContext('2d');
//ctx.strokeStyle = "rgba(255,255,255,0.3)";
//ctx.lineWidth = 4;
//ctx.beginPath();
//ctx.arc(5, 5, 2, 0, Math.PI * 2);
//ctx.stroke();
//
//exports.state = {
//id: "WEATHER",
//last: "MAIN_MENU",
//
//enter: function () {
// //Clears the UI layer for demo
// renderer.layerUI.clear();
//},
//
//update: function (delta, lastInput) {
//
// // action leads into main menu (Thanks BlackCat
// if (lastInput && lastInput.key === input.TYPE_ACTION)
//   this.changeState("MAIN_MENU");
//
// //Particle creation (totally fixed up to take as little memory as possible)
// for (var i = 0; i < type.length + 1; i++) {
//   //This one liner prevents massive amount of particles
//   if (i == cap)
//     break;
//   if (parseInt(Math.random() * FREQUENCY) == 1) {
//     if (i == type.length) {
//       type.push(parseInt(Math.random() * 3));
//       posx.push(((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200);
//       posy.push(-10);
//       break;
//     }
//     if (type[i] == -1) {
//       type[i] = parseInt(Math.random() * 3);
//       posx[i] = ((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200;
//       posy[i] = -10;
//       break;
//     }
//
//   }
// }
//
// if (constants.DEBUG) {
//   console.log("Quick render of snow... Delta is " + delta);
// }
//
// var dis = parseInt((250 / 1000) * delta, 10);
// var disQuart = parseInt(dis / 4, 10) || 1;
//
// // var store += delta;
// //while(var store > var MAX){
// //Snow particle updates
// for (var i = 0; i < type.length; i++) {
//   if (type[i] == -1)
//     continue;
//
//   if (type[i] == 2) {
//     posx[i] += disQuart;
//   }
//   posx[i] += disQuart;
//   posy[i] += dis;
//
//   //Destroy particles
//   if (posy[i] > renderer.screenHeight + 10)
//     type[i] = -1;
// }
// // var store -= var MAX;
// //}
//},
//
//render: function () {
// var ctx = renderer.layerUI.getContext();
//
// //Tests the speed of each particle for debug mode
// if (constants.DEBUG) {
//   time = (new Date()).getTime();
// }
//
// ctx.fillStyle = "black";
// ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);
//
// //Render particles
// for (var i = 0; i < type.length; i++) {
//   if (type[i] == -1)
//     continue;
//
//   ctx.drawImage(ball, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
// }
//
// //Finishes the testing of speed for snow particles
// if (constants.DEBUG) {
//   console.log("Quick render of snow... needed " + ((new Date()).getTime() - time) + "ms");
// }
//}
//};




///*jslint node: true, plusplus: true, vars: true */
//"use strict";
//
//// rain.js
////
//// A simple class that does the rain demo in JS
////
//// @author = Carr, Crecen
//// @version = 04.30.14
////
////First attempt at creating the rain weather for JavaScript
//
//var renderer = require("../renderer");
//var constants = require("../constants");
//var stm = require("../statemachine");
//var input = require("../input");
//
////Since the time is so low I probably don't need to track it.
////But it seems memory intensive to pull off, there has to be
////a less expensive way
//
////Keeps track of the time
//var time = 0;
////Keeps track of delta time
//var store = 0;
////Maximum frame wait per particle
//var MAX = 8;
//
////Keeps track of the cap
//var cap = 50;
////Keeps track of the frequency of a raindrop
//var FREQUENCY = 1;
//
////The type of raindrop to draw
//var type = [];
////The x-axis position of the raindrop
//var posx = [];
////The y-axis position of the raindrop
//var posy = [];
//
////Holds the graphics for a simple raindrop (cache)
////Totally hard coded all the values here
//var ball = document.createElement('canvas');
//ball.width = 10;
//ball.height = 10;
//
//var ctx = ball.getContext('2d');
//ctx.strokeStyle = "rgba(255,255,255,0.3)";
//ctx.lineWidth = 1;
//ctx.beginPath();
//ctx.moveTo(0, 0);
//ctx.lineTo(4, 10);
//ctx.stroke();
//
//exports.state = {
//  id: "RAIN",
//  last: "MAIN_MENU",
//
//  enter: function () {
//    //Clears the UI layer for demo
//    renderer.layerUI.clear();
//  },
//
//  update: function (delta, lastInput) {
//
//    // action leads into main menu (Thanks BlackCat
//    if (lastInput && lastInput.key === input.TYPE_ACTION)
//      this.changeState("MAIN_MENU");
//
//    store += delta;
//    while (store > MAX) {
//      //Particle creation (totally fixed up to take as little memory as possible)
//      for (var i = 0; i < type.length + 1; i++) {
//        //This one liner prevents massive amount of particles
//        if (i == cap)
//          break;
//        if (parseInt(Math.random() * FREQUENCY) == 0) {
//          if (i == type.length) {
//            type.push(parseInt(Math.random() * 2));
//            posx.push(((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200);
//            posy.push(-10);
//            break;
//          }
//          if (type[i] == -1) {
//            type[i] = parseInt(Math.random() * 2);
//            posx[i] = ((Math.random() * renderer.screenWidth + 100 / 10) * 10) - 200;
//            posy[i] = -10;
//            break;
//          }
//
//        }
//      }
//
//      //Rain particle updates
//      for (var i = 0; i < type.length; i++) {
//        if (type[i] == -1)
//          continue;
//
//        posx[i] += 1;
//        posy[i] += 4;
//
//        //Destroy particles
//        if (posy[i] > renderer.screenHeight + 10)
//          type[i] = -1;
//      }
//      store -= MAX;
//    }
//  },
//
//  render: function () {
//    var ctx = renderer.layerUI.getContext();
//
//    //Tests the speed of each particle for debug mode
//    if (constants.DEBUG) {
//      time = (new Date()).getTime();
//    }
//
//    ctx.fillStyle = "black";
//    ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);
//
//    //Render particles
//    for (var i = 0; i < type.length; i++) {
//      if (type[i] == -1)
//        continue;
//
//      ctx.drawImage(ball, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
//    }
//
//    //Finishes the testing of speed for snow particles
//    if (constants.DEBUG) {
//      console.log("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
//    }
//  }
//};

