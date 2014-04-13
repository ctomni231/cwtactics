cwt.Player.unitAction({
  key:"explode",
  noAutoWait: true,

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Explode.canExplode(data.source.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = cwt.Explode.getExplosionRange(data.source.unit);
    dataBlock.p4 = cwt.Explode.getExplosionDamage(data.source.unit);
  },

  parseDataBlock: function (dataBlock) {
    cwt.Explode.explode(dataBlock.p1,dataBlock.p2,dataBlock.p3,dataBlock.p4);
  }
});
