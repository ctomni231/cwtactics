"use strict";

var transport = require("../logic/transport");
var relation = require("../logic/relationship");
var model = require("../model");

exports.actionUnload = {
  multiStepAction: true,

  relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],

  condition: function (transporter, x, y) {
    return (transport.isTransportUnit(transporter) && transport.canUnloadSomethingAt(transporter, x, y));
  },

  prepareMenu: function (transporter, x, y, menu) {
    var transporterId = model.units.indexOf(transporter);

    for(var i = 0, e= model.units.length; i<e; i++) {
      if (model.units[i].loadedIn == transporterId) {
        menu.addEntry(i,true);
      }
    }
  },

  targetSelectionType: "B",
  prepareTargets: function (transporter, x, y, load, selection) {
    if (transport.canUnloadSomethingAt(transporter, x - 1, y)) selection.setValue(x - 1, y, 1);
    if (transport.canUnloadSomethingAt(transporter, x + 1, y)) selection.setValue(x + 1, y, 1);
    if (transport.canUnloadSomethingAt(transporter, x, y + 1)) selection.setValue(x, y + 1, 1);
    if (transport.canUnloadSomethingAt(transporter, x, y - 1)) selection.setValue(x, y - 1, 1);
  },

  invoke: function (transporterId, tx, ty, loadId, ux, uy) {
    // TODO wrong arguments
    transport.unload(
      model.units[transporterId], tx, ty,
      model.units[loadId], ux, uy
    );
  }
};

exports.actionLoad = {
  relation: ["S", "T", relation.RELATION_OWN],

  condition: function (transporter, load) {
    return (transport.isTransportUnit(transporter) && transport.canLoadUnit(transporter, load));
  },

  invoke: function (transporterId, loadId) {
    transport.load(model.units[transporterId], model.units[loadId]);
  }
};
