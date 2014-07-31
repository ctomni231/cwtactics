"use strict";

var relation = require("../logic/relationship");
var explode = require("../logic/exploder");

exports.action = {
  noAutoWait: true,

  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (data) {
    return explode.canSelfDestruct(data.source.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = explode.getSuicideRange(data.source.unit);
    dataBlock.p4 = explode.getExplosionDamage(data.source.unit);
  },

  parseDataBlock: function (dataBlock) {
    explode.explode(dataBlock.p1, dataBlock.p2, dataBlock.p3, dataBlock.p4);
  }
};