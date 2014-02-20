cwt.Action.unitAction({
  key:"joinUnits",
  noAutoWait: true,

  relation:[
    "S","T",
    cwt.Relationship.RELATION_OWN
  ],

  condition: function( data ){
    return cwt.Join.canJoin(data.source.unit,data.target.unit);
  },


  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId;
    dataBlock.p2 = data.target.unitId;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Join.join(
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p2)
    );

    cwt.Gameround.setActableStatus(dataBlock.p1,false);
  }

});
