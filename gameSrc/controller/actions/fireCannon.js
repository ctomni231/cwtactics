cwt.Action.unitAction({
  key: "fireCannon",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAMETHING
  ],

  condition: function (data) {
    return (
      cwt.Cannon.isCannonUnit(data.source.unit) &&
        cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
      );
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = data.targetselection.x;
    dataBlock.p4 = data.targetselection.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3, dataBlock.p4);
  }

});
