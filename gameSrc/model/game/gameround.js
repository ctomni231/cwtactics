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
   */
  turnOwner: null,

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
  players: [],

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
    return this.players.length * v;
  },

  /**
   * Ends the turn for the current active turn owner.
   */
  nextTurn: function () {
    var pid = this.players.indexOf(this.turnOwner);
    var oid = pid;
    var i, e;

    // Try to find next player from the player pool
    pid++;
    while (pid !== oid) {

      if (pid === MAX_PLAYER) {
        pid = 0;

        // Next day
        model.round_day++;

        cwt.Gameround.weatherLeftDays--;

        var round_dayLimit = controller.configValue("round_dayLimit");
        if (round_dayLimit > 0 && this.day >= round_dayLimit) {

          // TODO
          controller.update_endGameRound();
        }
      }

      // Found next player
      if (this.players[pid].team !== INACTIVE_ID) break;

      // Try next player
      pid++;
    }

    // If the new player id is the same as the old
    // player id then the game data is corrupted
    if( DEBUG ) assert(pid !== oid);

    // Do end/start turn logic
    this.playerEndsTurn_(this.players[oid]);
    this.playerStartsTurn_(this.players[pid]);
  },

  /**
   *
   */
  playerEndsTurn_: function (player) {
  },

  /**
   *
   */
  playerStartsTurn_: function (player) {

    // Sets the new turn owner and also the client, if necessary
    this.turnOwner = player;
    if (cwt.Client.isLocal(player)) cwt.Client.lastPlayer = player;



    // the active client can see what his and all allied objects can see
    // TODO
    var clTid = model.client_lastPid;
    for (var i = 0, e = MAX_PLAYER; i < e; i++) {
      model.fog_visibleClientPids[i] = false;
      model.fog_visibleTurnOwnerPids[i] = false;

      if (model.player_data[i].team === INACTIVE_ID) continue;

      if (model.player_data[i].team === clTid) model.fog_visibleClientPids[i] = true;
      if (model.player_data[i].team === toTid) model.fog_visibleTurnOwnerPids[i] = true;
    }

    // recalculate fog
    this.fog.fullRecalculation();

    // Do turn start stuff for all **properties**
    for (i = 0, e = MAX_PROPERTIES; i < e; i++) {
      if (model.property_data[i].owner !== player) continue;


    }

    // Do turn start stuff for all **units**
    for (var i = 0, e = MAX_UNITS_PER_PLAYER; i < e; i++) {

      cwt.Gameround.actors[i] = (model.unit_data[i].owner !== INACTIVE_ID);
    }

    // Do host only actions
    if (cwt.Network.isHost()) {

      // Generate new weather
      if (this.weatherLeftDays === 0) {

      }

      // Do AI-Turn
      // TODO
    }

    /*

     var turnStartSupply = (controller.configValue("autoSupplyAtTurnStart") === 1);

     // do turn start stuff for all **units**
     i = model.unit_firstUnitId(pid);
     e = model.unit_lastUnitId(pid);
     for (; i < e; i++) {

     if (model.unit_data[i].owner === INACTIVE_ID) continue;
     model.events.nextTurn_unitCheck(i);
     }

     // start AI logic if new turn owner is AI controlled
     // this local instance is the host
     if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
     controller.ai_machine.event("tick");
     }

     var prop = model.property_data[i];
     if (prop.type.supply) {

     var x = prop.x;
     var y = prop.y;
     var pid = prop.owner;

     var check = model.unit_thereIsAUnit;
     var mode = model.MODE_OWN;
     if (controller.configValue("supplyAlliedUnits") === 1) mode = model.MODE_TEAM;

     if (check(x, y, pid, mode)) {
     var unitTp = model.unit_posData[x][y].type;
     if (prop.type.supply.indexOf(unitTp.ID) !== -1 ||
     prop.type.supply.indexOf(unitTp.movetype) !== -1) {

     model.events.supply_refillResources(model.unit_posData[x][y]);
     }
     }
     }
     */

    /*
     var prop = model.property_data[i];
     if (prop.type.repairs) {
     var x = prop.x;
     var y = prop.y;
     var pid = prop.owner;

     var check = model.unit_thereIsAUnit;
     var mode = model.MODE_OWN;
     if (controller.configValue("repairAlliedUnits") === 1) mode = model.MODE_TEAM;

     if (check(x, y, pid, mode)) {
     var unitTp = model.unit_posData[x][y].type;
     var value;
     value = prop.type.repairs.get(unitTp.ID);
     if (!value) value = prop.type.repairs.get(unitTp.movetype);

     // script it :P
     value = controller.scriptedValue(pid, "propertyHeal", value);

     if (value > 0) {
     model.events.healUnit(
     model.unit_extractId(model.unit_posData[x][y]),
     model.unit_convertPointsToHealth(value),
     true
     );
     }
     }
     }
     */
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