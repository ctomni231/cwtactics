"use strict";

var model = require("../model");
var assert = require("../functions").assert;
var constants = require("../constants");
var supply = require("./supply");

var cfgAutoSupply = require("../config").getConfig("autoSupplyAtTurnStart");

var endsTurn_ = function (player) {
};

var startsTurn_ = function (player) {

  // Sets the new turn owner and also the client, if necessary
  this.turnOwner = player;
  if (player.isClientControlled) cwt.Client.lastPlayer = player; //TODO

  // *************************** Update Fog ****************************

  // the active client can see what his and all allied objects can see
  // TODO
  var clTid = cwt.Player.activeClientPlayer.team;
  for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    var cPlayer = model.players[i];

    cPlayer.turnOwnerVisible = false;
    cPlayer.clientVisible = false;

    // player isn't registered
    if (cPlayer.team === constants.INACTIVE) continue;

    if (cPlayer.team === clTid) cPlayer.clientVisible = true;
    if (cPlayer.team === player.team) cPlayer.turnOwnerVisible = true;
  }

  var cUnit, cProp;

  // *************************** Turn start actions ****************************

  for (i = 0, e = model.properties.length; i < e; i++) {
    cProp = model.properties[i];
    if (cProp.owner !== player) continue;

    cwt.Supply.raiseFunds(cProp);
  }

  for (var i = 0, e = model.units.length; i < e; i++) {
    cUnit = model.units[i];
    if (cUnit.owner !== player) continue;

    cUnit.canAct = true;
    cwt.Supply.drainFuel(cUnit);
  }

  var turnStartSupply = (cfgAutoSupply.value === 1);

  var map = model.mapData;
  for (var x = 0, xe = model.mapWidth; x < xe; x++) {
    for (var y = 0, ye = model.mapHeight; y < ye; y++) {
      cUnit = map[x][y].unit;
      if (cUnit && cUnit.owner === player) {

        // supply units
        if (turnStartSupply && cwt.Supply.isSupplier(cUnit)) {
          cwt.supplyNeighbours(x, y);
        }

        // heal by property
        if (map[x][y].property && map[x][y].property.owner === player && cwt.Supply.canPropertyHeal(x, y)) {
          cwt.Supply.propertyHeal(x, y);
        }

        // unit is out of fuel
        if (cUnit.fuel <= 0) {
          cwt.Lifecycle.destroyUnit(x, y, false);
        }
      }
    }
  }
};

//
// Ends the turn for the current active turn owner.
//
exports.next = function () {
  var pid = cwt.Model.turnOwner.id;
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
      var round_dayLimit = cwt.Config.getValue("round_dayLimit");
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

  // TODO: into action
  // Do end/start turn logic
  endsTurn_(model.players[oid]);
  startsTurn_(model.players[pid]);
};