"use strict";

var model = require("../../gameSrc/model");

// languages
var i18n = require("../../gameSrc/localization");
i18n.registerLanguage("en",require("./languages/english.json"));
i18n.registerLanguage("de",require("./languages/german.json"));

// scripts
var events = require("../../gameSrc/events");

events.event("canBuild").subscribe(function (type) {
  if (type.ID === "NTNK" && model.gameMode === model.GAME_MODE_AW1) {
    return 0;
  }
});

events.event("calcVision").subscribe(function (unit,tile,vision) {
  var type = unit.type.ID;
  if (tile.type.ID === "MNTN" && (type === "INFT" || type === "MECH")) {
    return vision+3;
  } else {
    return vision;
  }
});