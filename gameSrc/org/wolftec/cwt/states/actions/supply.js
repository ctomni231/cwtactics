//"use strict";
//
//var constants = require("../constants");
//var relation = require("../logic/relationship");
//var assert = require("../system/functions").assert;
//var supply = require("../logic/supply");
//var model = require("../model");
//
//exports.action = {
//  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],
//
//  condition: function(unit, x, y) {
//    return (supply.isSupplier(unit) && supply.hasRefillTargetsNearby(unit, x, y));
//  },
//
//  invoke: function(x, y) {
//    assert(model.isValidPosition(x, y));
//
//    var unit = model.mapData[x][y].unit;
//    assert(unit && supply.isSupplier(unit));
//
//    if (supply.canRefillObjectAt(unit, x + 1, y)) actions.localAction("refillSupply", x + 1, y);
//    if (supply.canRefillObjectAt(unit, x - 1, y)) actions.localAction("refillSupply", x - 1, y);
//    if (supply.canRefillObjectAt(unit, x, y + 1)) actions.localAction("refillSupply", x, y + 1);
//    if (supply.canRefillObjectAt(unit, x, y - 1)) actions.localAction("refillSupply", x, y - 1);
//  }
//};
//
//exports.actionRefillSupply = {
//  invoke: function(x, y) {
//    if (constants.DEBUG) assert(model.mapData[x][y].unit);
//    supply.refillSuppliesByPosition(x, y);
//  }
//};
//
//exports.actionHealUnit = {
//  invoke: function(x, y) {
//    if (constants.DEBUG) assert(supply.canPropertyRepairAt(x, y));
//    supply.propertyRepairsAt(x, y);
//  }
//};