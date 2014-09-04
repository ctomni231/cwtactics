"use strict";

var model = require("../model");
var assert = require("../system/functions").assert;
var constants = require("../constants");
var supply = require("./supply");

var cfgAutoSupply = require("../config").getConfig("autoSupplyAtTurnStart");
var cfgDayLimit = require("../config").getConfig("round_dayLimit");

exports.startsTurn = function(player) {
  
  // Sets the new turn owner and also the client, if necessary
  if (player.clientControlled) {
    model.lastClientPlayer = player;
  }

  // *************************** Update Fog ****************************

  // the active client can see what his and all allied objects can see
  var clTid = model.lastClientPlayer.team;
  for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    var cPlayer = model.players[i];

    cPlayer.turnOwnerVisible = false;
    cPlayer.clientVisible = false;

    // player isn't registered
    if (cPlayer.team === constants.INACTIVE) continue;

    if (cPlayer.team === clTid) cPlayer.clientVisible = true;
    if (cPlayer.team === player.team) cPlayer.turnOwnerVisible = true;
  }
};

//
// Ends the turn for the current active turn owner.
//
exports.next = function () {
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
};
