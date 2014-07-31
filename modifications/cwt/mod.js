"use strict";

var model = require("../../gameSrc/model");

// languages
var i18n = require("../../gameSrc/localization");
i18n.registerLanguage("en",require("./languages/english.json"));
i18n.registerLanguage("de",require("./languages/german.json"));

// units
require("././AAIR");
require("././ARTY");
require("././BKBT");
require("././CRUS");
require("././LNDR");
require("././MISS");
require("././RCKT");
require("././SUBM");
require("././WRTK");
require("././ACAR");
require("././BCTR");
require("././BMBR");
require("././FGTR");
require("././MDTK");
require("././NTNK");
require("././RECN");
require("././TCTR");
require("././APCR");
require("././BKBM");
require("././BSHP");
require("././INFT");
require("././MECH");
require("././OOZM");
require("././STLH");
require("././TNTK");

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