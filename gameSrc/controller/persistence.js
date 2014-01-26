/**
 * @namespace
 */
cwt.Persistence = {

  /**
   * Saves the game model into a JSON compatible
   * data format.
   */
  saveModel: function () {
    var dom = {};
    var arr;

    // ---------------------------------------------

    // actors
    arr = [];
    for (var i = 0, e = cwt.Gameround.actors.length; i < e; i++) {
      if (cwt.Gameround.actors[i]) arr.push(i);
    }
    dom.actr = arr;

    // ---------------------------------------------

    dom.wth = cwt.Gameround.weather.ID;

    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------

    dom.trOw = cwt.Gameround.turnOwner;
    dom.day = cwt.Gameround.day;

    // ---------------------------------------------

    dom.gmTm = cwt.Gameround.gameTimeElapsed;
    dom.tnTm = cwt.Gameround.turnTimeElapsed;

    // ---------------------------------------------

    return JSON.stringify(dom);
  },

  /**
   * Loads a given model into the game engine.
   */
  loadModel: function (dom) {
    var i, e, data, player;

    // ---------------------------------------------

    assert(Array.isArray(dom.actr));
    i = dom.actr.length;
    while (i--) {
      assert(dom.actr[i] >= 0 && dom.actr[i] < MAX_UNITS_PER_PLAYER));
    cwt.Gameround.actors[dom.actr[i]] = true;

    // ---------------------------------------------

    assert(cwt.WeatherSheet.sheets.hasOwnProperty(dom.wth));
    cwt.Gameround.weather = cwt.WeatherSheet.sheets[dom.wth];

    // ---------------------------------------------

    for (i = 0, e = dom.players.length; i < e; i++) {
      data = dom.players[i];

      // check data
      assert(typeof data[1] === "string");
      assert(data[0] >= 0 && data[0] < MAX_PLAYER);
      assert(data[3] >= 0 && data[3] < MAX_PLAYER);
      assert(data[2] >= 0 && data[2] < 999999);
      assert(data[4] >= 0 && data[4] < 999999);

      // set player data
      player = cwt.Gameround.players[data[0]];
      player.name = data[1];
      player.gold = data[2];
      player.team = data[3];
      player.manpower = data[4];
    }

    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------

    assert(dom.trOw >= 0 && dom.trOw < 9999999);
    assert(dom.day >= 0 && dom.day < 9999999);

    cwt.Gameround.turnOwner = dom.trOw;
    cwt.Gameround.day = dom.day;

    // ---------------------------------------------

    assert(dom.gmTm >= 0);
    assert(dom.tnTm >= 0);

    cwt.Gameround.gameTimeElapsed = dom.gmTm;
    cwt.Gameround.turnTimeElapsed = dom.tnTm;

    // ---------------------------------------------

  },

  /**
   * Prepares the game model for a new game round.
   */
  prepareModel: function (dom) {
    var i, e, player;

    cwt.CommandStack.resetData();
    cwt.Client.lastPlayer = null;

    // ---------------------------------------------

    for (i = 0, e = MAX_UNITS_PER_PLAYER; i < e; i++) {
      cwt.Gameround.actors[i] = false;
    }

    // ---------------------------------------------

    cwt.Gameround.weather = model.data_defaultWeatherSheet;

    // ---------------------------------------------

    cwt.Gameround.turnOwner = -1;
    cwt.Gameround.day = 0;

    // ---------------------------------------------

    assert(dom.player >= 2 && dom.player <= MAX_PLAYER);

    for (i = 0, e = MAX_PLAYER; i < e; i++) {
      player = cwt.Gameround.players[i];
      player.name = null;
      player.gold = 0;
      player.manpower = Math.POSITIVE_INFINITY;
      player.team = (i <= dom.player - 1) ? i : DESELECT_ID;
    }

    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
    // ---------------------------------------------
  }

};