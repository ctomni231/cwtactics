//
//
// @namespace
//
cwt.Team = {

  //
  // Different available money transfer steps.
  //
  MONEY_TRANSFER_STEPS: [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
  ],

  //
  // Returns `true` when a player can transfer money to a tile owner.
  //
  canTransferMoney: function (player, x, y) {
    if (player.gold < this.MONEY_TRANSFER_STEPS[0]) {
      return false;
    }

    // only transfer money on headquarters
    var property = cwt.Model.mapData[x][y].property;
    return (property && property.type.looseAfterCaptured && property.owner !== player);
  },

  // 
  // Returns `true` when a player can transfer money
  // to a tile owner.
  //
  getTransferMoneyTargets: function (player, menuObject) {
    for (var i = 0, e = this.MONEY_TRANSFER_STEPS.length; i < e; i++) {
      if (player.gold >= this.MONEY_TRANSFER_STEPS[i]) {
        menuObject.addEntry(this.MONEY_TRANSFER_STEPS[i]);
      }
    }
  },

  //
  // Transfers money from one player to another player.
  //
  // @param playerA
  // @param playerB
  // @param money
  //
  transferMoney: function (playerA, playerB, money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    cwt.assert(playerA.gold >= 0);
  },

  //
  //
  //
  canTransferUnit: function (unit) {
    if (cwt.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

    return !cwt.Transport.hasLoads(unit);
  },

  //
  //
  //
  getUnitTransferTargets: function (player, menu) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    var origI = player.ID;
    for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Model.players[i];
      if (!player.isInactive() && player.numberOfUnits < cwt.MAX_UNITS) {
        menu.addEntry(i, true);
      }
    }
  },

  //
  //
  // @param unit
  // @param player
  //
  transferUnitToPlayer: function (unit, player) {
    if (cwt.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);
    if (cwt.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    var origPlayer = unit.owner;

    if (cwt.DEBUG) cwt.assert(player.numberOfUnits < cwt.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
      cwt.Model.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
  },

  //
  //
  //
  canTransferProperty: function (property) {
    return (property.type.notTransferable !== true);
  },

  //
  //
  //
  getPropertyTransferTargets: function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Model.players[i];
      if (!player.isInactive()) {
        menu.addEntry(i, true);
      }
    }
  },

  //
  //
  //
  transferPropertyToPlayer: function (property, player) {
    var origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
      cwt.Model.searchProperty(property, this.changeVision_, null, origPlayer);
    }
  },

  //
  //
  // @param x
  // @param y
  // @param object
  // @param oldOwner
  // @private
  //
  changeVision_: function (x, y, object, oldOwner) {
    if (object instanceof cwt.UnitClass) {
      cwt.Fog.removeUnitVision(x, y, oldOwner);
      cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
      cwt.Fog.removePropertyVision(x, y, oldOwner);
      cwt.Fog.addPropertyVision(x, y, object.owner);
    }
  }
};