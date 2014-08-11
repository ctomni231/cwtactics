"use strict";

var relation = require("../logic/relationship");
var supply = require("../logic/supply");
var model = require("../model");

exports.action = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (unit, x, y) {
    return ( supply.isSupplier(unit) && supply.canSupplyTile(unit, x, y) );
  },

  invoke: function (x, y) {
    supply.supplyNeighbours(x, y);
  }
};
