cwt.Action.unitAction({
  key: "wait",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAMETHING
  ],

  condition: function (data) {
    return cwt.Gameround.canAct(data.source.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Gameround.setActableStatus(dataBlock.p1,false);
  }
});