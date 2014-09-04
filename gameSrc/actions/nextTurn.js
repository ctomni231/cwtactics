"use strict";

var network = require("../network");
var model = require("../model");

var assert = require("../system/functions").assert;

var actions = require("../actions");

var weather = require("../logic/weather");
var turn = require("../logic/turn");
var fog = require("../logic/fog");
var supply = require("../logic/supply");

var statemachine = require("../statemachine");

function checkForRepairTargets(x, y, tile) {

  // check repair via property 
  if (tile.unit.hp < 99) actions.localAction("healUnit", x, y);

  // give funds 
  exports.raiseFunds(tile.property);
}

function checkForSupplyTargets(x, y, tile) {

  // check neighbours
  if (supply.isSupplier(tile.unit)) {
    if (supply.canRefillObjectAt(tile.unit, x + 1, y)) actions.localAction("refillSupply", x + 1, y);
    if (supply.canRefillObjectAt(tile.unit, x - 1, y)) actions.localAction("refillSupply", x - 1, y);
    if (supply.canRefillObjectAt(tile.unit, x, y + 1)) actions.localAction("refillSupply", x, y + 1);
    if (supply.canRefillObjectAt(tile.unit, x, y - 1)) actions.localAction("refillSupply", x, y - 1);
  }

  // drain fuel
  supply.drainFuel(tile.unit);
}

exports.action = {
  invoke: function(startTurn) {
    assert(arguments.length === 0 || startTurn === 1);

    // special variable for the first turn -> we need the turn start actions after starting the game without
    // changing internal day data 
    if (startTurn) {
      turn.startsTurn(model.turnOwner);
    } else {
      turn.next()

      if (network.isHost()) {

        // check for next weather stuff
        if (model.weatherLeftDays === 0) {
          var nextWeather = weather.pickRandomWeatherId();
          var nextDuration = weather.pickRandomWeatherTime(nextWeather);

          actions.sharedAction("changeWeather", nextWeather, nextDuration);
        }

        // TODO: Do AI-Turn
        /*
         if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
         controller.ai_machine.event("tick");
         }
         */
      }
    }

    // recalc fog
    fog.fullRecalculation();

    // do supply actions
    model.onEachTile(checkForRepairTargets, true, true, model.turnOwner);
    model.onEachTile(checkForSupplyTargets, true, false, model.turnOwner);

    statemachine.changeState("ANIMATION_NEXT_TURN");
  }
};