/**
 * @namespace
 */
cwt.Gameround = {
  
  /**
   * The current active co mode.
   */
  gamemode: model.co_MODES.AW1,
  
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
   */
  turnOwner: null,

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
   * Maximum turn time limit in ms.
   */
  turnTimeLimit: 0,

  /**
   * Current elapsed turn time in ms.
   */
  turnTimeElapsed: 0,

  /**
   * Maximum game time limit in ms.
   */
  gameTimeLimit: 0,

  /**
   * Current elapsed game time in ms.
   */
  gameTimeElapsed: 0,
  
  /**
   * Holds all players.
   */
  players:[],
  
  /**
   * Visible tiles for the turn owner.
   */
  fog: new cwt.Fog(),

  /**
   * 
   */
  map: new cwt.Map(),

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
  setActableStatus: function( uid, value ){
    this.actors[uid] = value;
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
    return model.player_data.length * v;
  }

};
