//
// Module to control the lifecycle of game objects.
//
cwt.Lifecycle = {

  //
  // Returns an inactive **unit object** or **null** if every slot in the unit list is used.
  //
  getInactiveUnit: function() {
    for (var i = 0, e = cwt.Model.units.length; i < e; i++) {
      if (!cwt.Model.units[i].owner) {
        return unit;
      }
    }
    return null;
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {cwt.Player|cwt.Unit|cwt.Property} player
  // @param type
  //
  createUnit: function(x, y, player, type) {
    if (cwt.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

    var tile = cwt.Model.mapData[x][y];

    if (cwt.DEBUG) {
      cwt.assert(player instanceof cwt.PlayerClass);
      cwt.assert(player.numberOfUnits < cwt.MAX_UNITS);
    }

    var unit = this.getInactiveUnit();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(type);

    cwt.Fog.addUnitVision(x, y, player);
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {boolean} silent
  //
  destroyUnit: function(x, y, silent) {
    var tile = cwt.Model.mapData[x][y];
    if (this.DEBUG) cwt.assert(tile.unit);

    cwt.Fog.removeUnitVision(x, y, tile.unit.owner);

    //TODO check loads

    // remove references
    var owner = tile.unit.owner;
    owner.numberOfUnits--;
    if (this.DEBUG) cwt.assert(owner.numberOfUnits >= 0);
    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 && owner.numberOfUnits === 0) {
      this.deactivatePlayer(owner);
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

    // drop units
    if (cwt.DEBUG) cwt.assert(player instanceof cwt.Player);
    for (var i = 0, e = cwt.Model.units.length; i < e; i++) {
      var unit = cwt.Model.units[i];
      if (unit.owner === player) {
        // TODO
      }
    }

    // drop properties
    for (var i = 0, e = cwt.Model.properties.size(); i < e; i++) {
      var prop = cwt.Model.properties[i];
      if (prop.owner === player) {
        prop.makeNeutral();

        // change type when the property is a changing type property
        var changeType = prop.type.changeAfterCaptured;
      }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!cwt.Model.areEnemyTeamsLeft()) {
      // TODO
    }
  },

  //
  //
  // @return {boolean}
  //
  hasFreeUnitSlot: function(player) {
    return player.numberOfUnits < cwt.Player.MAX_UNITS;
  }

};
