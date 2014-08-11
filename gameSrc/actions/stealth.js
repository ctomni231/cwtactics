"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var team = require("../logic/team");

exports.actionHide = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (unit) {
    return (unit.type.stealth = !unit.hidden);
  },

  invoke: function (unitId) {
    model.units[unitId].hidden = true;
  }
};

exports.actionUnhide = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (unit) {
    return (unit.type.stealth = unit.hidden);
  },

  invoke: function (unitId) {
    model.units[unitId].hidden = false;
  }
};
