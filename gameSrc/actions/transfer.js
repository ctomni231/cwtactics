"use strict";

var sheets = require("../sheets");
var model = require("../model");

var relation = require("../logic/relationship");
var team = require("../logic/team");

exports.actionMoney = {
  condition: function (player, x, y) {
    return team.canTransferMoney(player, x, y);
  },

  hasSubMenu: true,
  prepareMenu: function (player, menu) {
    team.getTransferMoneyTargets(player, menu);
  },

  invoke: function (sourcePlayerId, targetPlayerId, money) {
    team.transferMoney(model.players[sourcePlayerId], model.players[targetPlayerId], money);
  }
};

exports.actionProperty = {
  relationToProp: ["S", "T", relation.RELATION_SAME_THING],

  condition: function (property) {
    return team.canTransferProperty(property);
  },

  hasSubMenu: true,
  prepareMenu: function (player, menu) {
    team.getPropertyTransferTargets(player, menu);
  },

  invoke: function (propertyId, targetPlayerId) {
    team.transferPropertyToPlayer(model.properties[propertyId], model.players[targetPlayerId]);
  }
};

exports.actionUnit = {
  relation: ["S", "T", relation.RELATION_SAME_THING],

  condition: function (unit) {
    return team.canTransferUnit(unit);
  },

  hasSubMenu: true,
  prepareMenu: function (player, menu) {
    team.getUnitTransferTargets(player, menu);
  },

  invoke: function (unitId, targetPlayer) {
    team.transferUnitToPlayer(model.units[unitId], model.players[targetPlayer]);
  }
};
