cwt.Action.unitAction({
  key: "silofire",

  relation: [
    "S", "T",
    cwt.Player.RELATION_SAMETHING,
    cwt.Player.RELATION_NONE
  ],

  relationToProp: [
    "S", "T",
    cwt.Player.RELATION_NONE
  ],

  condition: function (data) {
    if (!cwt.Silo.isRocketSilo(data.target.property)) return false;
    if (!cwt.Silo.canBeFired(data.target.property, data.source.unit)) return false;
    return true;
  },

  prepareSelection: function (data) {
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },

  isTargetValid: function (data, x, y) {
    return cwt.Silo.canBeFiredTo(data.target.property, x, y);
  },

  toDataBlock: function (data, dataBlock) {

  },

  parseDataBlock: function (dataBlock) {

  }

  invoke: function (data) {
    controller.commandStack_sharedInvokement(
      "silofire_invoked",
      data.target.x,
      data.target.y,
      data.targetselection.x,
      data.targetselection.y,
      data.source.unit.owner
    );
  }
});
