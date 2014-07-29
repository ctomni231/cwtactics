require('../actions').unitAction({
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
    dataBlock.p2 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Join.join(
      // @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      dataBlock.p2, dataBlock.p3
    );
  }

});