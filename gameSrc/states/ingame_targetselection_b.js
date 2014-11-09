"use strict";

var targetSelectA = require("./ingame_targetselection_a");
var stateData = require("../states");

exports.state = Object.create(targetSelectA.state);
exports.state.id = "INGAME_SELECT_TILE_TYPE_B";