cwt.Action.unitAction({
  key: "capture",

  relation: [
    "S", "T",
    cwt.Player.RELATION_SAMETHING,
    cwt.Player.RELATION_NONE
  ],

  relationToProp: [
    "S", "T",
    cwt.Player.RELATION_ENEMY,
    cwt.Player.RELATION_NONE
  ],

  condition: function (data) {
    if (cwt.Capture.canCapture(data.source.unit)) return false;
    if (cwt.Capture.canBeCaptured(data.target.property)) return false;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.propertyId;
    dataBlock.p2 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Capture.captureProperty(
      cwt.Property.getInstance(dataBlock.p1),
      cwt.Unit.getInstance(dataBlock.p2)
    );
  }
});
