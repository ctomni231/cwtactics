cwt.Action.mapAction({
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
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p1),
      /** @type {cwt.Player} */ cwt.Player.getInstance(dataBlock.p2),
      dataBlock.p3
    );
  }

});
