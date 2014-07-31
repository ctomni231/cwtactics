"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var capture = require("../logic/capture");

exports.action = {
  relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],
  relationToProp: ["S", "T", relation.RELATION_ENEMY, relation.RELATION_NONE],

  condition: function (data) {
    if (capture.canCapture(data.source.unit)) return false;
    if (capture.canBeCaptured(data.target.property)) return false;
    return true;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.propertyId;
    dataBlock.p2 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    capture.captureProperty(model.properties[dataBlock.p1], model.units[dataBlock.p1]);
  }
};