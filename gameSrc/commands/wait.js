cwt.Action.unitAction({
  key: "wait",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAMETHING
  ],

  condition: function (data) {
    return data.source.unit.canAct;
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Unit.getInstance(dataBlock.p1).canAct = false;
  }
});