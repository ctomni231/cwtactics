cwt.persistence_deserialize_model = function (saveData, model) {

  cwt.assert_true(model.data_weatherSheets.hasOwnProperty(saveData.wth));
  model.weather_data = model.data_weatherSheets[saveData.wth];

  assert(util.isInt(saveData.gmTm) && saveData.gmTm >= 0);
  assert(util.isInt(saveData.tnTm) && saveData.tnTm >= 0);

  model.timer_gameTimeElapsed = saveData.gmTm;
  model.timer_turnTimeElapsed = saveData.tnTm;

  cwt.map_for_each_property(saveData.cfg, function (key, value) {
    cwt.assert_true(util.isInt(value));
  });
  controller.buildRoundConfig(saveData.cfg);

  cwt.list_forEach(saveData.actr, function (element, index) {
    cwt.assert_true(util.intRange(element, 0, MAX_UNITS_PER_PLAYER));
    model.actions_leftActors[element] = true;
  });

  cwt.list_forEach(saveData.prps, function (data, index) {
    property = model.property_data[data[0]];
    property.capturePoints = data[4];
  });

  cwt.assert_true(util.intRange(saveData.trOw, 0, 999999));
  model.round_turnOwner = saveData.trOw;

  cwt.assert_true(util.intRange(saveData.day, 0, 999999));
  model.round_day = saveData.day;

  cwt.list_forEach(saveData.players, function (data, index) {
    var player;

    cwt.assert_true(util.intRange(data[0], 0, MAX_PLAYER - 1));
    cwt.assert_true(util.isString(data[1]));
    cwt.assert_true(util.intRange(data[2], 0, 999999));
    cwt.assert_true(util.intRange(data[3], 0, MAX_PLAYER - 1));

    player = model.player_data[data[0]];
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
  });

  cwt.assert_true(Array.isArray(saveData.manpower));
  cwt.list_forEach(saveData.manpower, function (power, index) {
    assert(util.isInt(power) && power >= 0);
  });
  model.manpower_data.grabValues(saveData.manpower);

  assert(saveData.dyea.length === saveData.dyev.length * 2);
  cwt.list_forEach(saveData.dyev, function (day_event_value, index) {
    cwt.require_integer(day_event_value);
    cwt.require_string(dom.dyee[index]);
    cwt.assert_true(day_event_value > 0);

    model.dayTick_dataTime[index] = day_event_value;
    model.dayTick_dataEvent[index] = dom.dyee[index];
    model.dayTick_dataArgs[2 * i] = dom.dyea[2 * index];
    model.dayTick_dataArgs[2 * i + 1] = dom.dyea[2 * index + 1];
  });

  cwt.assert_true(saveData.co.length == MAX_PLAYER);
  cwt.list_forEach(saveData.co, function (source, index) {
    if (source > 0) {
      var target;

      // check data
      cwt.assert_true(util.intRange(source[0], 0, 999999));
      cwt.assert_true(util.intRange(source[1], 0, 999999));
      cwt.assert_true(util.intRange(source[2], model.co_MODES.NONE, model.co_MODES.AWDR));
      cwt.assert_true(util.isString(source[3]) && model.data_coSheets.hasOwnProperty(source[3]));
      cwt.assert_true(util.isString(source[4]) && model.data_coSheets.hasOwnProperty(source[4]));

      // load data
      target = model.co_data[i];
      target.power = source[0];
      target.timesUsed = source[1];
      target.level = source[2];
      target.coA = (source[3]) ? model.data_coSheets[source[3]] : null;
      target.coB = (source[4]) ? model.data_coSheets[source[4]] : null;
    }
  });
};
