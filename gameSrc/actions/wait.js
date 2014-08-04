"use strict";

var relation = require("../logic/relationship");
var model = require("../model");

exports.action = {
  relation: [
    "S", "T",
    relation.RELATION_NONE,
    relation.RELATION_SAME_THING
  ],

  condition: function (data) {
    return data.source.unit.canAct;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    model.units[dataBlock.p1].setActable(false);
  }
};