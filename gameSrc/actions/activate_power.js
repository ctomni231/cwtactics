cwt.Action.mapAction({
  key: "activatePower",

  condition: function () {
    return cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_COP);
  },

  hasSubMenu: true,
  prepareMenu: function (data) {

    data.menu.addEntry("cop");
    if (cwt.CO.canActivatePower(cwt.Gameround.turnOwner, cwt.CO.POWER_LEVEL_SCOP)) {
      data.menu.addEntry("scop");
    }
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = (data.action.selectedSubEntry === "cop" ? cwt.CO.POWER_LEVEL_COP : -1);
    dataBlock.p1 = (data.action.selectedSubEntry === "scop" ? cwt.CO.POWER_LEVEL_SCOP : -1);
  },

  parseDataBlock: function (dataBlock) {
    cwt.CO.activatePower(cwt.Gameround.turnOwner,dataBlock.p1);
  }
});
