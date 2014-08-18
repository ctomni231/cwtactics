"use strict";

var modDTO = require("../dataTransfer/mod");
var i18n = require("../system/localization");

exports.loader = function (next) {
  if (require("../constants").DEBUG) {
    console.log("language selection");
  }

  var mod = modDTO.getMod();
  var langList = Object.keys(mod["languages"]);
  langList.forEach(function (lang) {
    i18n.registerLanguage(lang, mod["languages"][lang]);
  });

  // todo: recognize custom user selected language

  var language = window.navigator.userLanguage || window.navigator.language;
  var key;

  switch (language) {

    // german ?
    case "de":
    case "de-de":
    case "de-De":
    case "german":
    case "Deutsch":
      key = "de";

    // fallback: english
    default:
      key = "en";
  }

  // select language
  i18n.selectLanguage(key);

  next();
};
