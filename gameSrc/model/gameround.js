/**
 * @namespace
 */
cwt.Gameround = {

  /**
   * Advance Wars 1 game mode. The first ever released game mode
   * of the advance wars series (GBA and up).
   */
  GAME_MODE_AW1: 0,

  /**
   * Advance Wars 2 game mode. It introduced the Super CO Power.
   */
  GAME_MODE_AW2: 1,

  /**
   * The current active co mode.
   */
  gamemode: this.GAME_MODE_AW1,

  /**
   * The current active day.
   */
  day: 0,

  /**
   * The current active turn owner. Only the turn owner
   * can do actions.
   *
   * @type {cwt.Player}
   */
  turnOwner: null,

  /**
   * Maximum turn time limit in ms.
   *
   * @type {Number}
   */
  turnTimeLimit: 0,

  /**
   * Current elapsed turn time in ms.
   *
   * @type {Number}
   */
  turnTimeElapsed: 0,

  /**
   * Maximum game time limit in ms.
   *
   * @type {Number}
   */
  gameTimeLimit: 0,

  /**
   * Current elapsed game time in ms.
   *
   * @type {Number}
   */
  gameTimeElapsed: 0,

  /**
   * Returns `true` when at least two opposite teams are left, else `false`.
   */
  areEnemyTeamsLeft: function () {
    var player;
    var foundTeam = -1;
    var i = 0;
    var e = cwt.Player.MULTITON_INSTANCES;

    for (; i < e; i++) {
      player = cwt.Player.getInstance(i);

      if (player.team !== -1) {

        // found alive player
        if (foundTeam === -1) foundTeam = player.team;
        else if (foundTeam !== player.team) {
          foundTeam = -1;
          break;
        }
      }
    }

    return (foundTeam === -1);
  },

  /**
   * Returns true if the given player id is the current turn owner.
   */
  isTurnOwner: function (player) {
    return this.turnOwner === player;
  },

  /**
   * Converts a number of days into turns.
   */
  convertDaysToTurns: function (days) {
    return cwt.Player.MULTITON_INSTANCES*days;
  },

  /**
   * The active weather type object.
   */
  weather: null,

  /**
   * The amount of days until the weather will be
   * changed.
   */
  weatherLeftDays: 0,

  /**
   * Returns `true` when the game is in the peace phase.
   */
  inPeacePhase: function () {
    return (this.day < cwt.Config.getValue("daysOfPeace"));
  }

};