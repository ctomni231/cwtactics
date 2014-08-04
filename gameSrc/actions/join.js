"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var join = require("../logic/join");

exports.action = {
  noAutoWait: true,

  relation: ["S", "T", relation.RELATION_OWN],

  condition: function (data) {
    return join.canJoin(data.source.unit, data.target.unit);
  },


  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    join.join(model.units[dataBlock.p1], dataBlock.p2, dataBlock.p3);
  }

};