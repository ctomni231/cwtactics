"use strict";

var constants = require("../constants");
var weather = require("../logic/weather");
var actions = require("../actions");
var network = require("../network");
var assert = require("../system/functions").assert;
var supply = require("./supply");
var model = require("../model");
var fog = require("../logic/fog");

var cfgAutoSupply = require("../config").getConfig("autoSupplyAtTurnStart");
var cfgDayLimit = require("../config").getConfig("round_dayLimit");


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

exports.startsTurn = function(player) {

  // Sets the new turn owner and also the client, if necessary
  if (player.clientControlled) {
    model.lastClientPlayer = player;
  }

  // *************************** Update Fog ****************************

  // the active client can see what his and all allied objects can see
  var clTid = model.lastClientPlayer.team;
  var i, e;
  for (i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    var cPlayer = model.players[i];

    cPlayer.turnOwnerVisible = false;
    cPlayer.clientVisible = false;

    // player isn't registered
    if (cPlayer.team === constants.INACTIVE) continue;

    if (cPlayer.team === clTid) {
      cPlayer.clientVisible = true;
    }
    if (cPlayer.team === player.team) {
      cPlayer.turnOwnerVisible = true;
    }
  }
};

exports.action = {
  invoke: function(startTurn) {
    assert(arguments.length === 0 || startTurn === 1);

    // special variable for the first turn -> we need the turn start actions after starting the game without
    // changing internal day data 
    if (startTurn) {
      exports.startsTurn(model.turnOwner);

    } else {
      var pid = model.turnOwner.id;
      var oid = pid;

      // Try to find next player from the player pool
      pid++;
      while (pid !== oid) {

        if (pid === constants.MAX_PLAYER) {
          pid = 0;

          // Next day
          model.day++;
          model.weatherLeftDays--;

          // TODO: into action
          var round_dayLimit = cfgDayLimit.value;
          if (round_dayLimit > 0 && model.day >= round_dayLimit) {
            cwt.Update.endGameRound();
            // TODO
          }
        }

        // Found next player
        if (model.players[pid].team !== constants.INACTIVE) break;

        // Try next player
        pid++;
      }

      // If the new player id is the same as the old
      // player id then the game aw2 is corrupted
      if (this.DEBUG) assert(pid !== oid);

      // Do end/start turn logic
      model.turnOwner = model.players[pid];
      exports.startsTurn(model.turnOwner);

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