cwt.Action.unitAction({
  key:"transferUnit",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Team.canTransferUnit(data.source.unit);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getUnitTransferTargets(data.source.unit.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId,
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferUnitToPlayer(
      /** @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2)
    );
  }

});
