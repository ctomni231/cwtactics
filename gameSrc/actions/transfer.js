"use strict";

var relation = require("../logic/relationship");
var sheets = require("../sheets");
var model = require("../model");
var team = require("../logic/team");

exports.actionMoney = {
  condition: function (data) {
    return team.canTransferMoney(model.turnOwner, data.target.x, data.target.y);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {
    team.getTransferMoneyTargets(model.turnOwner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = model.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
    dataBlock.p3 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    team.transferMoney(model.players[dataBlock.p1], model.players[dataBlock.p2], dataBlock.p3);
  }

};

exports.actionProperty = {
  relationToProp: [
    "S", "T",
    relation.RELATION_SAME_THING
  ],

  condition: function (data) {
    return team.canTransferProperty(data.source.property);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {
    team.getPropertyTransferTargets(data.source.property.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.propertyId;
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    team.transferPropertyToPlayer(model.players[dataBlock.p1], model.players[dataBlock.p2]);
  }
};

exports.actionUnit = {
  relation: [
    "S", "T",
    relation.RELATION_SAME_THING
  ],

  condition: function (data) {
    return team.canTransferUnit(data.source.unit);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {
    team.getUnitTransferTargets(data.source.unit.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    team.transferUnitToPlayer(model.units[dataBlock.p2], model.players[dataBlock.p2]);
  }
};
