cwt.persistence_prepare_map_model = function (model, map) {

  model.round_turnOwner = -1;
  model.round_day = 0;

  model.rule_map.resetValues();
  model.manpower_data.resetValues();
  model.dayTick_dataTime.resetValues();
  model.dayTick_dataEvent.resetValues();
  model.dayTick_dataArgs.resetValues();

  model.weather_data = model.data_defaultWeatherSheet;

  model.client_lastPid = INACTIVE_ID;

  controller.buildRoundConfig(null);

  model.map_width = map.mpw;
  model.map_height = map.mph;
  cwt.list_forEach(model.map_data, function (map_column, x) {
    cwt.list_forEach(map_column, function (tile, y) {
      if (model.map_isValidPosition(x, y)) {
        model.unit_posData[x][y] = null;
        model.property_posMap[x][y] = null;
        model.map_data[x][y] = model.data_tileSheets[map.typeMap[map.map[x][y]]];
      }
    });
  });

  cwt.list_forEach(model.actions_leftActors, function (canAct, id, actors) {
    actors[id] = false;
  });

  cwt.list_forEach(model.co_data, function (co_data) {
    co_data.power = 0;
    co_data.timesUsed = 0;
    co_data.level = INACTIVE_ID;
    co_data.coA = null;
    co_data.coB = null;
  });

  cwt.assert_true(util.intRange(map.player, 2, MAX_PLAYER));

  cwt.list_forEach(model.player_data, function (player, id) {
    player.name = "Player " + id;
    player.gold = 0;
    player.team = (id <= map.player - 1) ? id : DESELECT_ID;
  });
};
