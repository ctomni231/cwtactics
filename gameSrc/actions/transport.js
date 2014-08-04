"use strict";

var transport = require("../logic/transport");
var relation = require("../logic/relationship");
var model = require("../model");

exports.actionUnload = {
  multiStepAction: true,

  relation: [
    "S", "T",
    relation.RELATION_SAME_THING,
    relation.RELATION_NONE
  ],

  condition: function (data) {
    return ( transport.canUnloadSomethingAt(data.source.unit, data.target.x, data.target.y) );
  },

  prepareMenu: function (data) {
    model.events.unloadUnit_addUnloadTargetsToMenu(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.menu
    );
  },

  targetSelectionType: "B",
  prepareTargets: function (data) {
    model.events.unloadUnit_addUnloadTargetsToSelection(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.selection
    );
  },

  toDataBlock: function ( data, dataBlock) {
    dataBlock.p1 = data.target.unitId;
    dataBlock.p2 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    transport.unload(
      data.source.unit,
      data.target.x,
      data.target.y,
      data.action.selectedSubEntry,
      data.targetselection.x,
      data.targetselection.y
    );
  }
};

exports.actionLoad = {
  relation: [
    "S", "T",
    relation.RELATION_OWN
  ],

  condition: function (data) {
    return ( transport.canLoadUnit(data.target.unit, data.source.unit) );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.unitId;
    dataBlock.p2 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    transport.load(model.units[dataBlock.p1], model.units[dataBlock.p2]);
  }
};
