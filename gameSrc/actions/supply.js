"use strict";

var relation = require("../logic/relationship");
var supply = require("../logic/supply");
var model = require("../model");

exports.action = {
  relation: [
    "S", "T",
    relation.RELATION_NONE,
    relation.RELATION_SAME_THING
  ],

  condition: function (data) {
    return ( supply.isSupplier(data.target.unit) &&
      supply.canSupplyTile(data.target.unit, data.target.x, data.target.y) );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (datBlock) {
    supply.supplyNeighbours(datBlock.p1, datBlock.p2);
  }
};
