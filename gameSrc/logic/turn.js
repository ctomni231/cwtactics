/**
 *
 * @namespace
 */
cwt.Turn = {

  /**
   * Ends the turn for the current active turn owner.
   */
  next: function () {
    var pid = cwt.Gameround.turnOwner.id;
    var oid = pid;

    // Try to find next player from the player pool
    pid++;
    while (pid !== oid) {

      if (pid === cwt.Player.MULTITON_INSTANCES) {
        pid = 0;

        // Next day
        cwt.Gameround.day++;
        cwt.Gameround.weatherLeftDays--;

        var round_dayLimit = cwt.Config.getValue("round_dayLimit");
        if (round_dayLimit > 0 && this.day >= round_dayLimit) {
          cwt.Update.endGameRound();
        }
      }

      // Found next player
      if (cwt.Player.getInstance(pid).team !== INACTIVE_ID) break;

      // Try next player
      pid++;
    }

    // If the new player id is the same as the old
    // player id then the game aw2 is corrupted
    if (DEBUG) assert(pid !== oid);

    // Do end/start turn logic
    this.endsTurn_(cwt.Player.getInstance(oid));
    this.startsTurn_(cwt.Player.getInstance(pid));
  },

  /**
   *
   * @param {cwt.Player} player
   * @private
   */
  endsTurn_: function (player) {
  },

  /**
   *
   * @param {cwt.Player} player
   * @private
   */
  startsTurn_: function (player) {

    // Sets the new turn owner and also the client, if necessary
    this.turnOwner = player;
    if (cwt.Client.isLocal(player)) cwt.Client.lastPlayer = player;

    // the active client can see what his and all allied objects can see
    // TODO
    var clTid = cwt.Player.activeClientPlayer.team;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var cPlayer = cwt.Player.getInstance(i);

      cPlayer.turnOwnerVisible = false;
      cPlayer.clientVisible = false;

      // player isn't registered
      if (cPlayer.team === INACTIVE_ID) continue;

      if (cPlayer.team === clTid) cPlayer.clientVisible = true;
      if (cPlayer.team === player.team) cPlayer.turnOwnerVisible = true;
    }

    // recalculate fog
    cwt.Fog.fullRecalculation();

    var cUnit, cProp;

    // *******************************************************

    for (i = 0, e = cwt.Property.MULTITON_INSTANCES; i < e; i++) {
      cProp = cwt.Property.getInstance(i, false);
      if (!cProp || cProp.owner !== player) continue;

      cwt.Supply.raiseFunds(cProp);
    }

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      cUnit = /** @type {cwt.Unit} */ cwt.Unit.getInstance(i, true);
      if (!cUnit || cUnit.owner !== player) continue;

      cUnit.canAct = true;
      cwt.Supply.drainFuel(cUnit);
    }

    // *******************************************************

    var turnStartSupply = (cwt.Config.getValue("autoSupplyAtTurnStart") === 1);

    var map = cwt.Map.data;
    for (var x = 0, xe = cwt.Map.map_width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.map_height; y < ye; y++) {
        cUnit = map[x][y].unit;
        if (cUnit && cUnit.owner === player) {

          // supply units
          if (turnStartSupply && cwt.Supply.isSupplier(cUnit)) {
            cwt.supplyNeighbours(x, y);
          }

          // heal by property
          if (map[x][y].property && map[x][y].property.owner === player && cwt.Supply.canPropertyHeal(x, y)) {
            cwt.Supply.propertyHeal(x, y);
          }

          // unit is out of fuel
          if (cUnit.fuel <= 0) {
            cwt.Lifecycle.destroyUnit(x, y, false);
          }
        }
      }
    }

    // *******************************************************

    // Do host only actions
    if (cwt.Network.isHost()) {

      // Generate new weather
      if (cwt.Gameround.weatherLeftDays === 0) {
        cwt.Weather.calculateNextWeather();
      }

      // Do AI-Turn
      // TODO
      /*
       if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
       controller.ai_machine.event("tick");
       }
       */
    }
  }

};