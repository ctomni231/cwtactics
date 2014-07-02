(function () {

  var MONEY_TRANSFER_STEPS = [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
  ];

  cwt.Action.mapAction({
    key: "transferMoney",

    condition: function (data) {
      if (cwt.Gameround.turnOwner.gold < MONEY_TRANSFER_STEPS[0]) {
        return false;
      }

      // only transfer money on headquarters
      var property = cwt.Map.data[data.target.x][data.target.y].property;
      if (!property || !property.type.looseAfterCaptured || property.owner === cwt.Gameround.turnOwner) {
        return false;
      }

      return true;
    },

    hasSubMenu: true,
    prepareMenu: function (data) {
      for (var i = 0, e = MONEY_TRANSFER_STEPS.length; i < e; i++) {
        if (cwt.Gameround.turnOwner.gold >= MONEY_TRANSFER_STEPS[i]) {
          data.menu.addEntry(MONEY_TRANSFER_STEPS[i]);
        }
      }
    },

    toDataBlock: function (data, dataBlock) {
      dataBlock.p1 = cwt.Gameround.turnOwner.id;
      dataBlock.p2 = data.target.property.owner.id;
      dataBlock.p3 = data.selectedSubEntry;
    },

    invokeFromData: function (dataBlock) {
      this.invoke(
        cwt.Player.getInstance(dataBlock.p1),
        cwt.Player.getInstance(dataBlock.p2),
        dataBlock.p3
      );
    },

    invoke: function (fromPlayer, toPlayer, money) {
      fromPlayer.gold -= money;
      toPlayer.gold += money;

      // the amount of gold cannot be lower 0 after the transfer
      cwt.assert(fromPlayer.gold >= 0);

      cwt.ClientEvents.goldChange(fromPlayer, -money, 0, 0);
      cwt.ClientEvents.goldChange(toPlayer, money, 0, 0);
    }

  });

})();


/*
 model.event_on("transferMoney_invoked",function(){
 controller.updateSimpleTileInformation();
 });

 model.event_on("transferUnit_invoked",function( suid ){
 var unit = model.unit_data[suid];
 var x = -unit.x;
 var y = -unit.y;

 // CHECK NEW UNIT
 controller.updateUnitStatus( model.unit_extractId( model.unit_posData[x][y] ) );
 });

 */