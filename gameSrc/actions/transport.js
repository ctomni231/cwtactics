"use strict";

var transport = require("../logic/transport");
var relation = require("../logic/relationship");
var actions = require("../actions");
var sheets = require("../sheets");
var model = require("../model");
var move = require("../logic/move");

exports.actionUnload = {
  multiStepAction: true,

  relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],

  condition: function (transporter, x, y) {
    return (
      transport.isTransportUnit(transporter) &&
        transport.canUnloadSomethingAt(transporter, x, y)
    );
  },

  prepareMenu: function (transporter, x, y, menu) {
    var i, e;
    for (i = 0, e = model.units.length; i < e; i++) {
      if (model.getUnit(i).loadedIn === transporter) {
        menu.addEntry(i.toString(), true);
      }
    }
  },

  targetSelectionType: "B",
  prepareTargets: function (transporter, x, y, load, selection) {
    var loadMovetype = sheets.getSheet(sheets.TYPE_MOVETYPE, load.type.movetype);
    
    // check west 
    if (transport.canUnloadSomethingAt(transporter, x - 1, y) && move.canTypeMoveTo(loadMovetype, x - 1, y) ) {
      selection.setValue(x - 1, y, 1);
    }
    
    // check east
    if (transport.canUnloadSomethingAt(transporter, x + 1, y) && move.canTypeMoveTo(loadMovetype, x + 1, y)) {
      selection.setValue(x + 1, y, 1);
    }
    
    // check south
    if (transport.canUnloadSomethingAt(transporter, x, y + 1) && move.canTypeMoveTo(loadMovetype, x, y + 1)) {
      selection.setValue(x, y + 1, 1);
    }
    
    // check north
    if (transport.canUnloadSomethingAt(transporter, x, y - 1) && move.canTypeMoveTo(loadMovetype, x, y - 1)) {
      selection.setValue(x, y - 1, 1);
    }
  },

  invoke: function (transporterId, loadId, tx, ty, moveCode) {
    var load = model.getUnit(loadId);
    var transporter = model.getUnit(transporterId);

    transport.unload(transporter, load);

    // add commands in reverse order
    actions.localActionLIFO("wait", transporterId);
    actions.localActionLIFO("moveEnd", false, true);
    actions.localActionLIFO("moveAppend", moveCode);
    actions.localActionLIFO("moveStart", loadId, tx, ty);
  }
};

exports.actionLoad = {
  relation: ["S", "T", relation.RELATION_OWN],

  positionUpdateMode: actions.PREVENT_SET_NEW_POS,

  condition: function (transporter, load) {
    return (
      transport.isTransportUnit(transporter) &&
        transport.canLoadUnit(transporter, load));
  },

  invoke: function (transporterId, loadId) {
    transport.load(
      model.getUnit(transporterId),
      model.getUnit(loadId));
  }
};
