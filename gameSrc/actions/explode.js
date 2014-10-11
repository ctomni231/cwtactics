"use strict";

var relation = require("../logic/relationship");
var explode = require("../logic/exploder");

exports.action = {
  noAutoWait: true,

  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (unit) {
    return explode.canSelfDestruct(unit);
  },

  invoke: function (x, y, range, damage) {
    explode.explode(x, y, range, damage);
  }
};