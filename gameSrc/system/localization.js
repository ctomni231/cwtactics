"use strict";

var assert = require("./functions").assert;
var constants = require("./../constants");

/**
 * Holds all available languages.
 */
var languages = {};

/**
 * The current active language.
 */
var selected = null;

/**
 * Registers a language object. The properties of the object will be the keys and its
 * values the localized string for the key.
 */
exports.registerLanguage = function (key, obj) {
  if (!key || !obj) {
    throw new Error("IllegalArgumentException");
  }
  if (languages.hasOwnProperty(key)) {
    throw new Error("LanguageAlreadyRegisteredException");
  }

  // copy keys and values to a fresh object
  var newLang = {};
  var wordKey;
  for (wordKey in languages) {
    if (languages.hasOwnProperty(wordKey)) {
      newLang[wordKey] = obj[wordKey];
    }
  }

  // register it
  languages[key] = newLang;
};

/**
 * Selects a language by it's key.
 */
exports.selectLanguage = function (key) {
  if (!languages.hasOwnProperty(key)) {
    throw new Error("UnknownLanguageException");
  }
  selected = languages[key];
};

/**
 * Returns the localized string of a given identifier.
 */
exports.forKey = function (key) {
  if (!selected) {
    return key;
  }

  var str = selected[key];
  return (str || key);
};