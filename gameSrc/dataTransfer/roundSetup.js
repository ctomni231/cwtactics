"use strict";

var constants = require("../constants");
var assert = require("./functions").assert;
var sheets = require("../sheets");
var model = require("../model");

var lifecycleLogic = require("../logic/lifecycle");
var coLogic = require("../logic/co");

exports.CHANGE_TYPE = {
  CO_MAIN: 0,
  CO_SIDE: 1,
  GAME_TYPE: 2,
  PLAYER_TYPE: 3,
  TEAM: 4
};

var map = null;

// Data holder to remember selected commanders.
//
var co = [];

// Data holder to remember selected player types.
//
var type = [];

// Data holder to remember selected team settings.
//
var team = [];

//
// Changes a configuration parameter.
//
// @param pid player id
// @param type change type
// @param prev is it a set to previous value step (else next value)
//
exports.changeParameter = function (pid, type, prev) {
  if (constants.DEBUG) assert(type >= exports.CHANGE_TYPE.CO_MAIN && type <= exports.CHANGE_TYPE.TEAM);

  if (type[pid] === constants.DESELECT_ID) {
    return;
  }

  switch (type) {

    case exports.CHANGE_TYPE.CO_MAIN:
      var cSelect = co[pid];

      if (prev) {
        cSelect--;
        if (cSelect < 0) cSelect = sheets.commanders.types.length - 1;
      } else {
        cSelect++;
        if (cSelect >= sheets.commanders.types.length) cSelect = 0;
      }

      co[pid] = cSelect;
      break;

    // ---------------------------------------------------------

    case constants.CHANGE_TYPE.CO_SIDE:
      assert(false, "not supported yet");
      break;

    // ---------------------------------------------------------

    case constants.CHANGE_TYPE.GAME_TYPE:
      model.gameMode = model.gameMode === model.GAME_MODE_AW1 ? model.GAME_MODE_AW2 : model.GAME_MODE_AW1;
      break;

    // ---------------------------------------------------------

    case constants.CHANGE_TYPE.PLAYER_TYPE:
      var cSelect = type[pid];
      if (cSelect === constants.DESELECT_ID) break;

      if (prev) {
        cSelect--;
        if (cSelect < constants.INACTIVE) cSelect = 1;
      } else {
        cSelect++;
        if (cSelect >= 2) cSelect = constants.INACTIVE;
      }

      type[pid] = cSelect;
      break;

    // ---------------------------------------------------------

    case constants.CHANGE_TYPE.TEAM:
      var cSelect = team[pid];

      while (true) {

        // change selection here
        if (prev) {
          cSelect--;
          if (cSelect < 0) cSelect = 3;
        } else {
          cSelect++;
          if (cSelect >= 4) cSelect = 0;
        }

        // check team selection -> at least two different teams has to be set all times
        var s = false;
        for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
          if (i === pid) continue;

          if (type[i] >= 0 && team[i] !== cSelect) {
            s = true;
          }
        }

        if (s) break;
      }

      team[pid] = cSelect;
      break;
  }
};

//
// Does some preparations for the configuration screen.
//
exports.preProcess = function () {

  // reset config data
  for (var n = 0; n < constants.MAX_PLAYER; n++) {
    co[n] = 0;
    team[n] = constants.INACTIVE;
    type[n] = 0;
  }

  // create pre-set data which would allow to start the game round (enables fast game round mode)
  for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    if (i < map.player) {
      if (i === 0) {
        type[i] = 0;
      } else type[i] = 1;
      team[i] = i;

    } else {
      type[i] = constants.DESELECT_ID;
    }
  }
};

//
// Does some preparations for the game round initialization.
//
exports.postProcess = function () {
  var tmp;

  // TODO: player one is deactivated

  // de-register old players
  // controller.ai_reset();
  // model.events.client_deregisterPlayers();

  var onlyAI = true;
  for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    if (type[i] === 0) {
      onlyAI = false;
      break;
    }
  }

  // update model
  for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
    var player = model.players[i];

    if (type[i] >= 0) {

      player.gold = 0;
      player.team = team[i];

      if (type[i] === 1) {
        // controller.ai_register(i);
        if (onlyAI) {
          player.clientControlled = true;
        }
      } else {
        player.clientControlled = true;
        player.clientVisible = true;
      }

      tmp = (co[i] !== constants.INACTIVE) ? sheets.commanders.types[co[i]] : null;
      coLogic.setMainCo(player, tmp);

    } else {
      // Why another disable here ? There is the possibility that a map has units for a player that
      // will be deactivated in the config screen.. so deactivate them all
      lifecycleLogic.deactivatePlayer(player);
    }
  }
};