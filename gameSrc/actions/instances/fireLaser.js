cwt.Action.unitAction({
  key:"fireLaser",

  relation:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Laser.isLaser(data.target.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Laser.fireLaser(dataBlock.p1,dataBlock.p2);
  }
});
