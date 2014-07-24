//
// Ends the turn for the current active turn owner.
//
exports.next = function() {
  var pid = cwt.Model.turnOwner.id;
  var oid = pid;

  // Try to find next player from the player pool
  pid++;
  while (pid !== oid) {

    if (pid === cwt.MAX_PLAYERS) {
      pid = 0;

      // Next day
      cwt.Model.day++;
      cwt.Model.weatherLeftDays--;

      var round_dayLimit = cwt.Config.getValue("round_dayLimit");
      if (round_dayLimit > 0 && cwt.Model.day >= round_dayLimit) {
        cwt.Update.endGameRound();
        // TODO
      }
    }

    // Found next player
    if (cwt.Model.players[pid].team !== cwt.INACTIVE) break;

    // Try next player
    pid++;
  }

  // If the new player id is the same as the old
  // player id then the game aw2 is corrupted
  if (this.DEBUG) cwt.assert(pid !== oid);

  // Do end/start turn logic
  this.endsTurn_(cwt.Model.players[oid]);
  this.startsTurn_(cwt.Model.players[pid]);
};

//
//
// @param {cwt.Player} player
// @private
//
exports.endsTurn_ = function(player) {};

//
//
// @param {cwt.Player} player
// @private
//
exports.startsTurn_ = function(player) {

  // Sets the new turn owner and also the client, if necessary
  this.turnOwner = player;
  if (player.isClientControlled) cwt.Client.lastPlayer = player; //TODO

  // *************************** Update Fog ****************************

  // the active client can see what his and all allied objects can see
  // TODO
  var clTid = cwt.Player.activeClientPlayer.team;
  for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
    var cPlayer = cwt.Model.players[i];

    cPlayer.turnOwnerVisible = false;
    cPlayer.clientVisible = false;

    // player isn't registered
    if (cPlayer.team === cwt.INACTIVE) continue;

    if (cPlayer.team === clTid) cPlayer.clientVisible = true;
    if (cPlayer.team === player.team) cPlayer.turnOwnerVisible = true;
  }

  // recalculate fog
  cwt.Fog.fullRecalculation();

  var cUnit, cProp;

  // *************************** Turn start actions ****************************

  for (i = 0, e = cwt.Model.properties.length; i < e; i++) {
    cProp = cwt.Model.properties[i];
    if (cProp.owner !== player) continue;

    cwt.Supply.raiseFunds(cProp);
  }

  for (var i = 0, e = cwt.Model.units.length; i < e; i++) {
    cUnit = cwt.Model.units[i];
    if (cUnit.owner !== player) continue;

    cUnit.canAct = true;
    cwt.Supply.drainFuel(cUnit);
  }

  var turnStartSupply = (cwt.Config.getValue("autoSupplyAtTurnStart") === 1);

  var map = cwt.Map.data;
  for (var x = 0, xe = cwt.Model.mapWidth; x < xe; x++) {
    for (var y = 0, ye = cwt.Model.mapHeight; y < ye; y++) {
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

  // *************************** Host only actions ****************************

  if (cwt.Network.isHost()) {

    // Generate new weather
    if (cwt.Model.weatherLeftDays === 0) {
      cwt.Weather.calculateNextWeather();
    }

    // Do AI-Turn
    // TODO: sadasdas
    /*
     if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
     controller.ai_machine.event("tick");
     }
     */
  }
};