/**
 *
 * @namespace
 */
cwt.Team = {

  /**
   * Different available money transfer steps.
   */
  MONEY_TRANSFER_STEPS: [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
  ],

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   */
  canTransferMoney: function (player, x, y) {
    if (player.gold < this.MONEY_TRANSFER_STEPS[0]) {
      return false;
    }

    // only transfer money on hq's
    var property = cwt.Map.data[x][y].property;
    if (!property || !property.type.looseAfterCaptured || property.owner === player) {
      return false;
    }

    return true;
  },

  /**
   * Returns `true` when a player can transfer money
   * to a tile owner.
   *
   * @param player
   * @param menu
   */
  getTransferMoneyTargets: function (player, menu) {
    for (var i = 0, e = this.MONEY_TRANSFER_STEPS.length; i < e; i++) {
      if (player.gold >= this.MONEY_TRANSFER_STEPS[i]) {
        menu.addEntry(this.MONEY_TRANSFER_STEPS[i]);
      }
    }
  },

  /**
   * Transfers money from one player to another player.
   *
   * @param playerA
   * @param playerB
   * @param money
   */
  transferMoney: function (playerA, playerB, money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    cwt.assert(playerA.gold >= 0);

    cwt.ClientEvents.goldChange(playerA, -money, 0, 0);
    cwt.ClientEvents.goldChange(playerB, money, 0, 0);
  },

  /**
   *
   */
  canTransferUnit: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    if (cwt.Transport.hasLoads(unit)) return false;
    return true;
  },

  /**
   *
   */
  getUnitTransferTargets: function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Player.getInstance(i, true);
      if (player && player.team !== cwt.INACTIVE) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   * @param unit
   * @param player
   */
  transferUnitToPlayer: function (unit, player) {
    var origPlayer = unit.owner;

    if (this.DEBUG) cwt.assert(player.numberOfUnits < cwt.Player.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    //
    if (origPlayer.team !== player.team) {
      cwt.Map.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
  },

  /**
   *
   */
  canTransferProperty: function (property) {
    return (property.type.notTransferable !== true);
  },

  /**
   *
   */
  getPropertyTransferTargets: function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Player.getInstance(i, true);
      if (player && player.team !== cwt.INACTIVE) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   */
  transferPropertyToPlayer: function (property, player) {
    var origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    //
    if (origPlayer.team !== player.team) {
      cwt.Map.searchProperty(property, this.changeVision_, null, origPlayer);
    }
  },

  /**
   *
   * @param x
   * @param y
   * @param object
   * @param oldOwner
   * @private
   */
  changeVision_: function (x, y, object, oldOwner) {
    if (object instanceof cwt.Unit) {
      cwt.Fog.removeUnitVision(x, y, oldOwner);
      cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
      cwt.Fog.removePropertyVision(x, y, oldOwner);
      cwt.Fog.addPropertyVision(x, y, object.owner);
    }
  }
};