"use strict";

var model = require("../model");
var factory = require("../logic/factory");

exports.action = {
  condition: function (data) {
    return (factory.isFactory(data.source.property) && factory.canProduce(data.source.property) );
  },

  hasSubMenu: true,
  prepareMenu: function (data) {
    factory.generateBuildMenu(data.source.property, data.menu, true);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = model.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
  },

  parseDataBlock: function (dataBlock) {
    factory.buildUnit(model.properties[dataBlock.p1], dataBlock.p2);
  }
};