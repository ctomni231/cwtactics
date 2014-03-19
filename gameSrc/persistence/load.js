/**
 * Loads a given model into the game engine.
 */
cwt.Persistence.loadModel = function (dom) {
  var i, e, data, player, keys;

  // ---------------------------------------------

  cwt.assert(Array.isArray(dom.actr));
  i = dom.actr.length;
  while (i--) {
    cwt.assert(dom.actr[i] >= 0 && dom.actr[i] < cwt.Player.MAX_UNITS);
    cwt.Gameround.actors[dom.actr[i]] = true;
  }

  // ---------------------------------------------

  cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(dom.wth));
  cwt.Gameround.weather = cwt.WeatherSheet.sheets[dom.wth];

  // ---------------------------------------------

  for (i = 0, e = dom.players.length; i < e; i++) {
    data = dom.players[i];

    // check aw2
    cwt.assert(typeof data[1] === "string");
    cwt.assert(data[0] >= 0 && data[0] < cwt.Player.MULTITON_INSTANCES);
    cwt.assert(data[3] >= 0 && data[3] < cwt.Player.MULTITON_INSTANCES);
    cwt.assert(data[2] >= 0 && data[2] < 999999);
    cwt.assert(data[4] >= 0 && data[4] < 999999);

    // set player aw2
    player = cwt.Player.getInstance(data[0]);
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
    player.manpower = data[4];
  }

  // ---------------------------------------------

  var source, target, i, e;

  cwt.assert(Array.isArray(dom.co) && dom.co.length === MAX_PLAYER);

  i = 0;
  e = MAX_PLAYER;
  for (; i < e; i++) {
    source = dom.co[i];
    if (source > 0) {

      // check aw2
      cwt.assert(util.intRange(source[0], 0, 999999));
      cwt.assert(util.intRange(source[1], 0, 999999));
      cwt.assert(util.intRange(source[2], model.co_MODES.NONE, model.co_MODES.AWDR));
      cwt.assert(util.isString(source[3]) && model.data_coSheets.hasOwnProperty(source[3]));
      cwt.assert(util.isString(source[4]) && model.data_coSheets.hasOwnProperty(source[4]));

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

  cwt.assert(dom.trOw >= 0 && dom.trOw < 9999999);
  cwt.assert(dom.day >= 0 && dom.day < 9999999);

  cwt.Gameround.turnOwner = dom.trOw;
  cwt.Gameround.day = dom.day;

  // ---------------------------------------------

  cwt.assert(dom.gmTm >= 0);
  cwt.assert(dom.tnTm >= 0);

  cwt.Gameround.gameTimeElapsed = dom.gmTm;
  cwt.Gameround.turnTimeElapsed = dom.tnTm;

  // ---------------------------------------------

};