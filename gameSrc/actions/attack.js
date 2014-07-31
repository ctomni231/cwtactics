"use strict";

var relation = require("../logic/relationship");
var constant = require("../constants");
var attack = require("../logic/attack");
var model = require("../model");

exports.action = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (data) {
    if (model.inPeacePhase()) return false;

    return attack.hasTargets(data.source.unit, data.target.x, data.target.y, data.movePath.data[0] !== constant.INACTIVE);
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    attack.calculateTargets(data.source.unit, data.target.x, data.target.y, data.selection);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.targetselection.unitId;
    dataBlock.p3 = Math.round(Math.random() * 100);
    dataBlock.p4 = Math.round(Math.random() * 100);
  },

  parseDataBlock: function (dataBlock) {
    attack.attack(model.units[dataBlock.p1], model.units[dataBlock.p2], dataBlock.p3, dataBlock.p4);
  }
};