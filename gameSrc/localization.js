"use strict";

var assert = require("./functions").assert;
var constants = require("./constants");

// Holds all available languages.
//
var languages = {};

// The current active language.
//
var selected = null;

// Registers a language object. The properties of the object will be the keys and its values the localized
// string for the key.
//
exports.registerLanguage = function (key, obj) {
  if (constants.DEBUG) assert(key && obj && !languages.hasOwnProperty(key));
  languages[key] = obj;
};

//
//
exports.selectLanguage = function (key) {
  if (constants.DEBUG) assert(languages.hasOwnProperty(key));
  selected = languages[key];
};

// Returns the localized string of a given identifier.
//
exports.forKey = function (key) {
  if (constants.DEBUG) assert(selected);

  var str = selected[key];
  return (str) ? str : key;
};