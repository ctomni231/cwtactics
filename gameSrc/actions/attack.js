"use strict";

var relation = require("../logic/relationship");
var constant = require("../constants");
var attack = require("../logic/attack");
var model = require("../model");

var assert = require("../system/functions").assert;

exports.action = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (attacker, x, y, moved) {
    if (model.inPeacePhase()) return false;
    return attack.hasTargets(attacker, x, y, moved);
  },

  targetSelectionType: "A",
  prepareTargets: function (unit, x, y, selection) {
    attack.calculateTargets(unit, x, y, selection);
  },

  invoke: function (attackerId, defenderId, luckAttacker, luckDefender) {
    assert(model.isValidUnitId(attackerId));
    assert(model.isValidUnitId(defenderId));
    assert(luckAttacker >= 0 && luckAttacker <= 100);
    assert(luckDefender >= 0 && luckDefender <= 100);

    attack.attack(
      model.units[attackerId],
      model.units[defenderId], 
      luckAttacker, 
      luckDefender
    );
  }
};