cwt.GameSelectionDTO = {

  /**
   * @constant
   */
  CHANGE_TYPE: {
    CO_MAIN: 0,
    CO_SIDE: 1,
    GAME_TYPE: 2,
    PLAYER_TYPE: 3,
    TEAM: 4
  },

  map: null,

  /**
   * Data holder to remember selected co's.
   */
  co: null,

  /**
   *
   */
  type: null,

  /**
   *
   */
  team: null,

  /**
   * Changes a configuration parameter.
   *
   * @param pid player id
   * @param type change type
   * @param prev is it a set to previous value step (else next value)
   */
  changeParameter: function (pid, type, prev) {
    if (cwt.DEBUG) cwt.assert(type >= this.CHANGE_TYPE.CO_MAIN && type <= this.CHANGE_TYPE.TEAM);

    if (this.type[pid] === cwt.DESELECT_ID) {
      return;
    }

    switch (type) {

      case this.CHANGE_TYPE.CO_MAIN:
        var cSelect = this.co[pid];

        if (prev) {
          cSelect--;
          if (cSelect < 0) cSelect = cwt.CoSheet.types.length - 1;
        }
        else {
          cSelect++;
          if (cSelect >= cwt.CoSheet.types.length) cSelect = 0;
        }

        this.co[pid] = cSelect;
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.CO_SIDE:
        cwt.assert(false, "not supported yet");
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.GAME_TYPE:
        if (prev) {
          if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW1) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW2;
          } else if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW2) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW1;
          }
        } else {
          if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW1) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW2;
          } else if (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW2) {
            cwt.Gameround.gameMode = cwt.Gameround.GAME_MODE_AW1;
          }
        }
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.PLAYER_TYPE:
        var cSelect = this.type[pid];
        if (cSelect === cwt.DESELECT_ID) break;

        if (prev) {
          cSelect--;
          if (cSelect < cwt.INACTIVE) cSelect = 1;
        }
        else {
          cSelect++;
          if (cSelect >= 2) cSelect = cwt.INACTIVE;
        }

        this.type[pid] = cSelect;
        break;

      // ---------------------------------------------------------

      case this.CHANGE_TYPE.TEAM:
        var cSelect = this.team[pid];

        while (true) {
          if (prev) {
            cSelect--;
            if (cSelect < 0) cSelect = 3;
          }
          else {
            cSelect++;
            if (cSelect >= 4) cSelect = 0;
          }

          var s = false;
          for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
            if (i === pid) continue;

            if (this.type[i] >= 0 && this.team[i] !== cSelect) {
              s = true;
            }
          }

          if (s) break;
        }

        this.team[pid] = cSelect;
        break;
    }
  },

  /**
   * Does some preparations for the configuration screen.
   */
  preProcess: function () {

    // lazy init config data
    if (!this.co) {
      this.co = [];
      this.team = [];
      this.type = [];
    }

    // reset config data
    for (var n = 0; n < cwt.Player.MULTITON_INSTANCES; n++) {
      this.co[n] = 0;
      this.team[n] = cwt.INACTIVE;
      this.type[n] = 0;
    }

    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i < this.map.player) {

        if (i === 0) {
          this.type[i] = 0;
        } else this.type[i] = 1;

        this.team[i] = i;

      } else {
        this.type[i] = cwt.DESELECT_ID;
      }
    }
  },

  /**
   * Does some preparations for the game round initialization.
   */
  postProcess: function () {
    var tmp;

    // TODO: player one is deactivated

    // deregister old players
    // controller.ai_reset();
    // model.events.client_deregisterPlayers();

    var onlyAI = true;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (this.type[i] === 0) {
        onlyAI = false;
        break;
      }
    }

    // update model
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var player = cwt.Player.getInstance(i);

      if (this.type[i] >= 0) {

        player.gold = 0;
        player.team = this.team[i];

        if (this.type[i] === 1) {
          // controller.ai_register(i);
          // if (onlyAI) model.events.client_registerPlayer(i);
        } else {
          // model.events.client_registerPlayer(i);
        }

        tmp = ( this.co[i] !== cwt.INACTIVE) ?
          cwt.CoSheet.types[this.co[i]] : null;

        cwt.CO.setMainCo(player, tmp);

      } else {

        // deactivate player
        player.team = cwt.INACTIVE;

        // remove all units
        var firstUid = model.unit_firstUnitId(i);
        var lastUid = model.unit_lastUnitId(i);
        for (; firstUid <= lastUid; firstUid++) {
          var unit = model.unit_data[firstUid];
          if (unit) {
            model.unit_posData[unit.x][unit.y] = null;
            model.unit_data[firstUid].owner = cwt.INACTIVE;
          }
        }

        // remove all properties
        for (var pi = 0, pe = model.property_data.length; pi < pe; pi++) {
          var prop = model.property_data[pi];
          if (prop && prop.owner === i) {
            prop.owner = cwt.INACTIVE;
          }
        }
      }
    }
  }
};