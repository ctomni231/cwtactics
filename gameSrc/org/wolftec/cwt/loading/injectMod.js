"use strict";

var constants = require("../constants");
var modDTO = require("../dataTransfer/mod");
var sheets = require("../sheets");
var image = require("../image");

exports.loader = function (next) {
  var mod = modDTO.getMod();

  image.minimapIndex = mod.minimapIndex;

  mod.movetypes.forEach(function (movetype) {
    sheets.movetypes.registerSheet(movetype);
  });

  mod.commanders.forEach(function (commander) {
    sheets.commanders.registerSheet(commander);
  });

  mod.units.forEach(function (unit) {
    sheets.units.registerSheet(unit);
  });

  mod.properties.forEach(function (property) {
    sheets.properties.registerSheet(property);
  });

  mod.tiles.forEach(function (tile) {
    sheets.tiles.registerSheet(tile);
  });

  mod.weathers.forEach(function (weather) {
    sheets.weathers.registerSheet(weather);
  });

  next();
};