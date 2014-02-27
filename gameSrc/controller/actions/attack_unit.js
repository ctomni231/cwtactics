cwt.Action.unitAction({
  key: "attack",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAMETHING
  ],

  condition: function (data) {
    if (cwt.Gameround.inPeacePhase()) return false;

    return cwt.Attack.hasTargets(
      data.source.unit,
      data.target.x,
      data.target.y,
      data.movePath.data[0] !== cwt.INACTIVE
    );
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    cwt.Attack.calculateTargets(
      data.source.unit,
      data.target.x,
      data.target.y,
      data.selection
    );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.targetselection.unitId;
    dataBlock.p3 = Math.round(Math.random() * 100);
    dataBlock.p4 = Math.round(Math.random() * 100);
  },

  parseDataBlock: function (dataBlock) {
    cwt.Attack.attack(
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p2),
      dataBlock.p3,
      dataBlock.p4
    );
  }
});
