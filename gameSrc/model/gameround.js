cwt.Config.create("timer_turnTimeLimit",0,60,0);
cwt.Config.create("timer_gameTimeLimit",0,99999,0);

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
   * Holds the identical numbers of all objects that can act during
   * the turn. After a unit has acted, it should be removed from this
   * list with `model.actions_markUnitNonActable`.
   */
  actors: [],

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
   * Returns true if the selected uid can act in the current
   * active turn, else false.
   */
  canAct: function (unit) {
    assert(model.unit_isValidUnitId(uid));

    var startIndex = model.round_turnOwner * MAX_UNITS_PER_PLAYER;
    if (uid >= startIndex + MAX_UNITS_PER_PLAYER || uid < startIndex) {
      return false;
    } else return (model.actions_leftActors[uid - startIndex] === true);
  },

  /**
   *
   */
  setActableStatus: function (uid, value) {
    this.actors[uid] = value;
  },

  /**
   * Returns `true` when at least two opposite teams are left, else `false`.
   */
  areEnemyTeamsLeft: function () {
    var player;
    var foundTeam = -1;
    var i = 0;
    var e = this.players.length;

    for (; i < e; i++) {
      player = this.players[i];

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