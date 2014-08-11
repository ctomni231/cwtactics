"use strict";

var relation = require("../logic/relationship");
var capture = require("../logic/capture");
var model = require("../model");

exports.action = {
  relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],
  relationToProp: ["S", "T", relation.RELATION_ENEMY, relation.RELATION_NONE],

  condition: function (unit, property) {
    return (capture.canCapture(unit) && capture.canBeCaptured(property));
  },

  invoke: function (propertyId, unitId) {
    capture.captureProperty(model.properties[propertyId], model.units[unitId]);
  }
};