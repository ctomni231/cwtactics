cwt.Config = {

  configs_: {},

  //
  //
  //
  resetAll: function() {
    for (var i = this.MULTITON_NAMES.length - 1; i >= 0; i--) {
      this.getInstance(this.MULTITON_NAMES[i]).resetValue();
    }
  },

  //
  //
  // @param {String} name
  // @param {Number} min
  // @param {Number} max
  // @param {Number} defaultValue
  // @param {Number=} step
  //
  createConfig: function(name, min, max, defaultValue, step) {
    if (cwt.DEBUG) cwt.assert(!this.configs_[name]);

    this.configs_[name] = new cwt.Config(min, max, defaultValue, step);
  },

  createOption: function(name, min, max, defaultValue, step) {
    this.createConfig(name, min, max, defaultValue, step);
    this.configs_[name].userSelectable = false;
  },

  //
  // Returns the actual configuration value of a given configuration
  // key.
  //
  // @param {String} name
  //
  getValue: function(name) {
    return this.getInstance(name).value;
  },

  //
  // Returns the actual configuration object of a given configuration
  // key.
  //
  // @param {String} name
  //
  getConfig: function(name) {
    return this.getInstance(name);
  },

  //
  // Contains all features of the web client. If the value of a feature is `true`, then it will
  // be supported by the current active environment. If the value is `false`, then it isn't
  // supported.
  //
  features: {

    //
    // Controls the availability of audio effects.
    //
    audioSFX: ((Browser.chrome || Browser.safari || (Browser.ios && Browser.version >= 6)) === true),

    //
    // Controls the availability of music.
    //
    audioMusic: ((Browser.chrome || Browser.safari) === true),

    //
    // Controls the availability of game-pad input.
    //
    gamePad: ((Browser.chrome && !! navigator.webkitGetGamepads) === true),

    //
    // Controls the availability of computer keyboard input.
    //
    keyboard: ((!Browser.mobile) === true),

    //
    // Controls the availability of mouse input.
    //
    mouse: ((!Browser.mobile) === true),

    //
    // Controls the availability of touch input.
    //
    touch: ((Browser.mobile) === true),

    //
    // Signals a official supported environment. If false then it doesn't mean the
    // environment cannot run the game, but the status is not official tested. As
    // result the game could run fine or breaks.
    //
    supported: ((Browser.chrome || Browser.safari || Browser.ios || Browser.android) === true),

    // scaledImg:  false,

    //
    // Controls the usage of the workaround for the iOS7 WebSQL DB bug.
    //
    iosWebSQLFix: ((Browser.ios && Browser.version >= 7) === true)
  },

  configDTO: {

    //
    // @constant
    //
    CHANGE_TYPE: {
      CO_MAIN: 0,
      CO_SIDE: 1,
      GAME_TYPE: 2,
      PLAYER_TYPE: 3,
      TEAM: 4
    },

    map: null,

    //
    // Data holder to remember selected co's.
    //
    co: null,

    //
    //
    //
    type: null,

    //
    //
    //
    team: null,

    //
    // Changes a configuration parameter.
    //
    // @param pid player id
    // @param type change type
    // @param prev is it a set to previous value step (else next value)
    //
    changeParameter: function(pid, type, prev) {
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
          } else {
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
          } else {
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
            } else {
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

    //
    // Does some preparations for the configuration screen.
    //
    preProcess: function() {

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

    //
    // Does some preparations for the game round initialization.
    //
    postProcess: function() {
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
            if (onlyAI) {
              player.clientControlled = true;
            }
          } else {
            player.clientControlled = true;
            player.clientVisible = true;
          }

          tmp = (this.co[i] !== cwt.INACTIVE) ?
            cwt.CoSheet.types[this.co[i]] : null;

          cwt.CO.setMainCo(player, tmp);

        } else {
          // Why another disable here ?
          // There is the possibility that a map has units for a player that will be deactivated in the
          // config screen.. so deactivate them all

          cwt.Unit.destroyPlayerUnits(player);
          cwt.Property.releasePlayerProperties(player);

          // deactivate player
          player.team = cwt.INACTIVE;
        }
      }
    }
  }
};
