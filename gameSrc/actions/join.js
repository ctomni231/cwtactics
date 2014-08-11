"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var join = require("../logic/join");

exports.action = {
  noAutoWait: true,

  relation: ["S", "T", relation.RELATION_OWN],

  condition: function (sourceUnit, targetUnit) {
    return join.canJoin(sourceUnit, targetUnit);
  },

  invoke: function (sourceUnitId, x, y) {
    // TODO: better is sx,sy,tx,ty
    join.join(model.units[sourceUnitId], x, y);
  }

};