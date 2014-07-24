"use strict";

require('../actions').propertyAction({
  key:"buildUnit",

  condition: function( data ){
    return (
      cwt.Factory.isFactory(data.source.property) &&
      cwt.Factory.canProduce(data.source.property)
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    cwt.Factory.generateBuildMenu(
      data.source.property,
      data.menu,
      true
    );
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = cwt.Gameround.turnOwner.id;
    dataBlock.p2 = data.target.property.owner.id;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Factory.buildUnit(
      // @type {cwt.Property} */ cwt.Property.getInstance(dataBlock.p1),
      dataBlock.p2
    );
  }
});
