"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");
var sheets = require("../sheets");
var lifecycle = require("../logic/lifecycle");
var cfgUnitLimit = require("../config").getConfig("unitLimit");

//
// Returns **true** when the given **property** is a factory, else **false**.
//
exports.isFactory = function (property) {
  if (constants.DEBUG) assert(property instanceof model.Property);

  return (property.type.builds !== undefined);
};

//
// Returns **true** when the given **property** is a factory and can produce something technically, else **false**.
//
exports.canProduce = function (property) {
  if (constants.DEBUG) assert(exports.isFactory(property));

  // check left manpower
  if (!property.owner || !property.owner.manpower) return false;

  // check unit limit and left slots
  var count = property.owner.numberOfUnits;
  var uLimit = (cfgUnitLimit.value || 9999999);
  if (count >= uLimit || count >= constants.MAX_UNITS) return false;

  return true;
};

//
// Constructs a unit with **type** in a **factory** for the owner of the factory. The owner must have at least one
// of his unit slots free to do this.
//
exports.buildUnit = (function () {

  function buildIt(x, y, property, type) {
    // TODO
    lifecycle.createUnit(x, y, property.owner, type);
  }

  return function (factory, type) {
    if (constants.DEBUG) {
      assert(factory instanceof model.Property);
      assert(sheets.units.isValidType(type));
    }

    var sheet = sheets.units.sheets[type];

    factory.owner.manpower--;
    factory.owner.gold -= sheet.cost;

    if (constants.DEBUG) {
      assert(factory.owner.gold >= 0);
      assert(factory.owner.manpower >= 0);
    }

    model.searchProperty(factory, buildIt, null, type);
  };
})();

//
// Generates the build menu for a **factory** and puts the build able unit type ID's into a **menu**. If
// **markDisabled** is enabled then the function will add types that temporary aren't produce able (e.g. due
// lack of money) but marked as disabled.
//
exports.generateBuildMenu = function (factory, menu, markDisabled) {
  if (constants.DEBUG) {
    assert(factory instanceof model.Property);
    assert(factory.owner);
  }

  var unitTypes = sheets.units.types;
  var bList = factory.type.builds;
  var gold = factory.owner.gold;

  for (var i = 0, e = unitTypes.length; i < e; i++) {
    var key = unitTypes[i];
    var type = sheets.units.getSheet(key);

    if (bList.indexOf(type.movetype) === -1) continue;

    // Is the tile blocked ?
    if (type.blocked) return false;

    if (type.cost <= gold || markDisabled) {
      menu.addEntry(key, (type.cost <= gold));
    }
  }
};
