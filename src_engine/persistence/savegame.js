cwt.persistence_serialize_model = function (model) {
  var saveModel;

  saveModel = {};

  saveModel.cfg = model.cfg_configuration;

  saveModel.gmTm = model.timer_gameTimeElapsed;
  saveModel.tnTm = model.timer_turnTimeElapsed;

  saveModel.wth = model.weather_data.ID;
  saveModel.trOw = model.round_turnOwner;
  saveModel.day = model.round_day;
  saveModel.mpw = model.manpower_data.cloneValues([]);

  saveModel.mpw = model.map_width;
  saveModel.mph = model.map_height;
  saveModel.map = [];

  saveModel.dyet = [];
  saveModel.dyee = [];
  saveModel.dyea = [];

  var i = 0;
  var e = model.dayTick_dataTime.length;
  for (; i < e; i++) {

    if (list[i] !== INACTIVE_ID) {
      saveModel.dyet.push(list[i]);
      saveModel.dyee.push(model.dayTick_dataEvent[i]);
      saveModel.dyea.push(model.dayTick_dataArgs[2 * i], model.dayTick_dataArgs[2 * i + 1]);
    }
  }

  // generates ID map
  var mostIdsMap = {};
  var mostIdsMapCurIndex = 0;
  for (var x = 0, xe = model.map_width; x < xe; x++) {

    saveModel.map[x] = [];
    for (var y = 0, ye = model.map_height; y < ye; y++) {

      var type = saveModel.map[x][y].ID;

      if (!mostIdsMap.hasOwnProperty(type)) {
        mostIdsMap[type] = mostIdsMapCurIndex;
        mostIdsMapCurIndex++;
      }

      saveModel.map[x][y] = mostIdsMap[type];
    }
  }

  // store map
  saveModel.typeMap = [];
  var typeKeys = Object.keys(mostIdsMap);
  for (var i = 0, e = typeKeys.length; i < e; i++) {
    saveModel.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
  }

  saveModel.units = [];
  cwt.list_forEach(model.unit_data, function (unit, id) {
    if (unit.owner !== INACTIVE_ID) {
      saveModel.units.push([
        model.unit_extractId(unit),
        unit.type.ID,
        unit.x,
        unit.y,
        unit.hp,
        unit.ammo,
        unit.fuel,
        unit.loadedIn,
        unit.owner
      ]);
    }
  });

  saveModel.prps = [];
  cwt.list_forEach(model.property_data, function (prop, id) {
    if (prop.owner !== INACTIVE_ID) {
      saveModel.prps.push([
        i,
        prop.x,
        prop.y,
        prop.type.ID,
        prop.capturePoints,
        prop.owner
      ]);
    }
  });

  saveModel.co = [];
  cwt.list_forEach(model.co_data, function (co_data, id) {
    if (model.player_data[i].team === INACTIVE_ID) {
      saveModel.co.push(0); // TODO type break
    } else {
      saveModel.co.push([
        co_data.power,
        co_data.timesUsed,
        co_data.level,
        co_data.coA,
        co_data.coB
      ]);
    }
  });

  saveModel.actr = [];
  cwt.list_forEach(model.actions_leftActors, function (canAct, id) {
    if (canAct) saveModel.actr.push(id);
  });

  return saveModel;
};
