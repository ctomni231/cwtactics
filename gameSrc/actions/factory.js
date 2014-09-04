"use strict";

var model = require("../model");
var factory = require("../logic/factory");
var renderer = require("../renderer");
var fog = require("../logic/fog");

exports.action = {
  condition: function (property) {
    return (factory.isFactory(property) && factory.canProduce(property) );
  },

  hasSubMenu: true,
  prepareMenu: function (property, menu) {
    factory.generateBuildMenu(property, menu, true);
  },

  invoke: function (factoryId, type) {
    factory.buildUnit(model.properties[factoryId], type);
    renderer.renderUnitsOnScreen();
    fog.fullRecalculation();
  }
};
