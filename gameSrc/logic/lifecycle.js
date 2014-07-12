//
//
// @namespace
//
cwt.Lifecycle = {

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {cwt.Player|cwt.Unit|cwt.Property} player
  // @param type
  //
  createUnit: function(x, y, player, type) {
    if (player instanceof cwt.Unit || player instanceof cwt.Property) {
      player = player.owner;
    }

    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var tile = cwt.Map.data[x][y];

    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);
    if (this.DEBUG) cwt.assert(this.hasFreeUnitSlot(player));

    var unit = this.getFreeUnitSlot();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(type);

    cwt.Fog.addUnitVision(x, y, player);

    cwt.ClientEvents.unitCreated(x, y, unit);
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {boolean} silent
  //
  destroyUnit: function(x, y, silent) {
    var tile = cwt.Map.data[x][y];
    if (this.DEBUG) cwt.assert(tile.unit);

    cwt.ClientEvents.unitDestroyed(x, y, tile.unit);

    cwt.Fog.removeUnitVision(x, y, tile.unit.owner);

    // remove references
    tile.unit.owner.numberOfUnits--;
    if (this.DEBUG) cwt.assert(tile.unit.owner.numberOfUnits >= 0);
    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 && cwt.Unit.countUnitsOfPlayer(this.owner) === 0) {
      cwt.Player.deactivate();
    }
  },

  //
  // A player has loosed the game round due a specific reason. This
  // function removes all of his units and properties. Furthermore
  // the left teams will be checked. If only one team is left then
  // the end game event will be invoked.
  //
  // @param {cwt.Player} player
  //
  deactivatePlayer: function(player) {
    cwt.Unit.destroyPlayerUnits(player);
    cwt.Property.releasePlayerProperties(player);

    this.team = cwt.INACTIVE;

    // when no opposite teams are found then the game has ended
    if (!cwt.Gameround.areEnemyTeamsLeft()) {
      // TODO
    }
  },

  //
  //
  // @return {boolean}
  //
  hasFreeUnitSlot: function(player) {
    return player.numberOfUnits < cwt.Player.MAX_UNITS;
  },

  //
  // Returns the index of the next free unit slot.
  //
  // @return {cwt.Unit|null}
  //
  getFreeUnitSlot: function() {
    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      var unit = cwt.Unit.getInstance(i);
      if (!unit.owner) {
        return // @type {cwt.Unit} */ unit;
      }
    }
    return null;
  }

};
