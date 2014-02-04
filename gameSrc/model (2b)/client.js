/**
 * @namespace
 */
cwt.Client = {

  /**
   * Contains all player instances that will be controlled by the local
   * client including AI instances.
   */
  instances: null,

  /**
   * The `pid` of the last active local player.
   */
  lastPlayer: null,

  /**
   * Visible tiles for the client.
   */
  fog: new cwt.Fog(),

  /**
   * Returns `true` when the given `pid` is controlled by the active client.
   */
  isLocal: function (player) {
    if (DEBUG) assert(player instanceof cwt.Player);
    return this.instances[pid] === true;
  },

  /**
   * Deregisters all players.
   */
  deregisterClientPlayers: function () {
    this.instances.resetValues();
  },

  /**
   * Registers a player `pid` as local player.
   */
  registerClientPlayer: function (pid) {
    assert(model.player_isValidPid(pid));

    this.instances[pid] = true;

    // set at least one player id
    if( this.lastPlayer === -1 ) this.lastPlayer = pid;

    return true;
  },

  /**
   * Registers a player `pid` as local player.
   */
  deregisterClientPlayer: function (pid) {
    this.instances[pid] = false;
    return true;
  }


};