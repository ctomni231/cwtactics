/**
 * @namespace
 */
cwt.Client = {

  /**
   * Returns `true` when the given `pid` is controlled by the active client.
   */
  isLocal: function (player) {
    if (DEBUG) assert(player instanceof cwt.Player);

    return this.clientControlled;
  },

  /**
   * De-Registers all players.
   */
  deRegisterClientPlayers: function () {
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      this.deRegisterClientPlayer(cwt.Player.getInstance(i));
    }
  },

  /**
   * Registers a player `pid` as local player.
   */
  registerClientPlayer: function (player) {
    if (DEBUG) assert(player instanceof cwt.Player);

    player.clientControlled = false;
    if (cwt.Player.activeClientPlayer) {
      cwt.Player.activeClientPlayer = player;
    }
  },

  /**
   * Registers a player `pid` as local player.
   */
  deRegisterClientPlayer: function (player) {
    if (DEBUG) assert(player instanceof cwt.Player);

    player.clientControlled = false;
    player.clientVisible = false;
    if (cwt.Player.activeClientPlayer === player) {
      cwt.Player.activeClientPlayer = null;
    }
  }

};