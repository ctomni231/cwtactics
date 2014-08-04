"use strict";

var relation = require("../logic/relationship");
var model = require("../model");
var team = require("../logic/team");

exports.actionHide = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (data) {
    return (data.source.unit.type.stealth = !data.source.unit.hidden);
  },

  invoke: function (data) {
    data.source.unit.hidden = true;
  }
};

exports.actionUnhide = {
  relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

  condition: function (data) {
    return (data.source.unit.type.stealth = data.source.unit.hidden);
  },

  invoke: function (data) {
    data.source.unit.hidden = false;
  }
};
