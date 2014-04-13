cwt.Action.unitAction({
  key: "supplyUnit",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    return (
      cwt.Supply.isSupplier(data.target.unit) &&
      cwt.Supply.canSupplyTile(data.target.unit, data.target.x, data.target.y) );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (datBlock) {
    cwt.Supply.supplyNeighbours(datBlock.p1, datBlock.p2);
  }

});
