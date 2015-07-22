"use strict";

var stateData = require("../dataTransfer/states");
var attack = require("../logic/attack");

exports.state = {
  id: "INGAME_IDLE",

  enter: function () {
    stateData.source.clean();
    stateData.target.clean();
    stateData.targetselection.clean();
  },

  ACTION: function () {
    var x = stateData.cursorX;
    var y = stateData.cursorY;

    stateData.source.set(x, y);
    stateData.target.set(x, y);

    this.changeState("INGAME_MOVEPATH");
  },

  CANCEL: function () {
    var x = stateData.cursorX;
    var y = stateData.cursorY;
    stateData.source.set(x, y);

    // go into attack range when a battle unit is selected
    var unit = stateData.source.unit;
    if (unit && (attack.hasMainWeapon(unit) || attack.hasSecondaryWeapon(unit) )) {
      this.changeState("INGAME_SHOW_ATTACK_RANGE");

    } else {
      stateData.source.clean();
    }
  }
};
