cwt.Action.propertyAction({

  key:"transferProperty",

  relationToProp:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data  ){
    return cwt.Team.canTransferProperty(data.source.property);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getPropertyTransferTargets(data.source.property.owner, data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.propertyId;
    dataBlock.p2 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferPropertyToPlayer(
      /** @type {cwt.Property} */ cwt.Property.getInstance(dataBlock.p1),
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2)
    );
  }
});
