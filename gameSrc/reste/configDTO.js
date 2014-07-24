cwt.Config = {

  // TODO move into flow
  roundConfiguration: {

    CHANGE_TYPE: {
      CO_MAIN: 0,
      CO_SIDE: 1,
      GAME_TYPE: 2,
      PLAYER_TYPE: 3,
      TEAM: 4
    },

    map: null,

    // Data holder to remember selected commanders.
    //
    co: [],

    // Data holder to remember selected player types.
    //
    type: [],

    // Data holder to remember selected team settings.
    //
    team: [],

    //
    // Changes a configuration parameter.
    //
    // @param pid player id
    // @param type change type
    // @param prev is it a set to previous value step (else next value)
    //
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
            if (cSelect < 0) cSelect = cwt.DataSheets.commanders.types.length - 1;
          } else {
            cSelect++;
            if (cSelect >= cwt.DataSheets.commanders.types.length) cSelect = 0;
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
            if (cwt.Model.gameMode === cwt.Model.GAME_MODE_AW1) {
              cwt.Model.gameMode = cwt.Model.GAME_MODE_AW2;
            } else if (cwt.Model.gameMode === cwt.Model.GAME_MODE_AW2) {
              cwt.Model.gameMode = cwt.Model.GAME_MODE_AW1;
            }
          } else {
            if (cwt.Model.gameMode === cwt.Model.GAME_MODE_AW1) {
              cwt.Model.gameMode = cwt.Model.GAME_MODE_AW2;
            } else if (cwt.Model.gameMode === cwt.Model.GAME_MODE_AW2) {
              cwt.Model.gameMode = cwt.Model.GAME_MODE_AW1;
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

            // change selection here
            if (prev) {
              cSelect--;
              if (cSelect < 0) cSelect = 3;
            } else {
              cSelect++;
              if (cSelect >= 4) cSelect = 0;
            }

            // check team selection -> at least two different teams has to be set all times
            var s = false;
            for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
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
    preProcess: function () {

      // reset config data
      for (var n = 0; n < cwt.MAX_PLAYER; n++) {
        this.co[n] = 0;
        this.team[n] = cwt.INACTIVE;
        this.type[n] = 0;
      }

      // create pre-set data which would allow to start the game round (enables fast game round mode)
      for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
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
    postProcess: function () {
      var tmp;

      // TODO: player one is deactivated

      // deregister old players
      // controller.ai_reset();
      // model.events.client_deregisterPlayers();

      var onlyAI = true;
      for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
        if (this.type[i] === 0) {
          onlyAI = false;
          break;
        }
      }

      // update model
      for (var i = 0, e = cwt.MAX_PLAYER; i < e; i++) {
        var player = cwt.Model.players[i];

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
            cwt.DataSheets.commanders.types[this.co[i]] : null;

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
