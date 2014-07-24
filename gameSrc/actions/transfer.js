"use strict";

require('../actions').mapAction({
  key:"transferMoney",

  condition: function( data ){
    return cwt.Team.canTransferMoney(
      cwt.Gameround.turnOwner,
      data.target.x,
      data.target.y
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Team.getTransferMoneyTargets(cwt.Gameround.turnOwner,data.menu);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = cwt.Gameround.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
    dataBlock.p3 = data.selectedSubEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Team.transferMoney(
      // @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p1),
      // @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2),
      dataBlock.p3
    );
  }

});

require('../actions').propertyAction({

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
      // @type {cwt.Property} */ cwt.Property.getInstance(dataBlock.p1),
      // @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2)
    );
  }
});

require('../actions').unitAction({
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
      // @type {cwt.Unit} */ cwt.Unit.getInstance(dataBlock.p1),
      // @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2)
    );
  }

});
