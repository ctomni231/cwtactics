/**
 * Loads a given model into the game engine.
 */
cwt.Persistence.loadModel = function (dom) {
  var i, e, data, player, keys;

  // ---------------------------------------------

  assert(Array.isArray(dom.actr));
  i = dom.actr.length;
  while (i--) {
    assert(dom.actr[i] >= 0 && dom.actr[i] < MAX_UNITS_PER_PLAYER);
    cwt.Gameround.actors[dom.actr[i]] = true;
  }

  // ---------------------------------------------

  assert(cwt.WeatherSheet.sheets.hasOwnProperty(dom.wth));
  cwt.Gameround.weather = cwt.WeatherSheet.sheets[dom.wth];

  // ---------------------------------------------

  for (i = 0, e = dom.players.length; i < e; i++) {
    data = dom.players[i];

    // check aw2
    assert(typeof data[1] === "string");
    assert(data[0] >= 0 && data[0] < MAX_PLAYER);
    assert(data[3] >= 0 && data[3] < MAX_PLAYER);
    assert(data[2] >= 0 && data[2] < 999999);
    assert(data[4] >= 0 && data[4] < 999999);

    // set player aw2
    player = cwt.Gameround.players[data[0]];
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
    player.manpower = data[4];
  }

  // ---------------------------------------------

  var source, target, i, e;

  assert(Array.isArray(dom.co) && dom.co.length === MAX_PLAYER);

  i = 0;
  e = MAX_PLAYER;
  for (; i < e; i++) {
    source = dom.co[i];
    if (source > 0) {

      // check aw2
      assert(util.intRange(source[0], 0, 999999));
      assert(util.intRange(source[1], 0, 999999));
      assert(util.intRange(source[2], model.co_MODES.NONE, model.co_MODES.AWDR));
      assert(util.isString(source[3]) && model.data_coSheets.hasOwnProperty(source[3]));
      assert(util.isString(source[4]) && model.data_coSheets.hasOwnProperty(source[4]));

      // load aw2
      target = model.co_data[i];
      target.power = source[0];
      target.timesUsed = source[1];
      target.level = source[2];
      target.coA = (source[3]) ? model.data_coSheets[source[3]] : null;
      target.coB = (source[4]) ? model.data_coSheets[source[4]] : null;
    }
  }

  // ---------------------------------------------

  var property;
  for (var i = 0, e = dom.prps.length; i < e; i++) {
    var data = dom.prps[i];

    property = model.property_data[data[0]];
    property.capturePoints = data[4];
  }

  // ---------------------------------------------

  if (dom.cfg) {
    keys = Object.keys(dom.cfg);
    for (i = 0, e = keys.length; i < e; i++) {
      cwt.Config.getConfig(keys[i])
        .setValue(dom.cfg[keys[i]]);
    };
  }

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

};