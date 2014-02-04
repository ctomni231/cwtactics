/**
 * Saves the game model into a JSON compatible
 * data format.
 */
cwt.Persistence.saveModel = function () {
  var dom = {};
  var arr, keys;

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

  var unit;

  dom.units = [];
  for (var i = 0, e = model.unit_data.length; i < e; i++) {
    unit = model.unit_data[i];

    if (unit.owner !== INACTIVE_ID) {
      dom.units.push([
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
  }

  // ---------------------------------------------

  var prop;

  dom.prps = [];
  for (var i = 0, e = model.property_data.length; i < e; i++) {
    prop = model.property_data[i];

    // persist it if the owner of the property is not INACTIVE
    if (prop.owner !== INACTIVE_ID) {
      dom.prps.push([
        i,
        prop.x,
        prop.y,
        prop.type.ID,
        prop.capturePoints,
        prop.owner
      ]);
    }
  }
  // ---------------------------------------------

  dom.mpw = model.map_width;
  dom.mph = model.map_height;
  dom.map = [];

  // generates ID map
  var mostIdsMap = {};
  var mostIdsMapCurIndex = 0;
  for (var x = 0, xe = model.map_width; x < xe; x++) {

    dom.map[x] = [];
    for (var y = 0, ye = model.map_height; y < ye; y++) {

      var type = dom.map[x][y].ID;

      if (!mostIdsMap.hasOwnProperty(type)) {
        mostIdsMap[type] = mostIdsMapCurIndex;
        mostIdsMapCurIndex++;
      }

      dom.map[x][y] = mostIdsMap[type];
    }
  }

  // store map
  dom.typeMap = [];
  var typeKeys = Object.keys(mostIdsMap);
  for (var i = 0, e = typeKeys.length; i < e; i++) {
    dom.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
  }

  // ---------------------------------------------

  // result document model (2b) for co data will be a matrix
  var data = [];
  var obj;

  for (var i = 0, e = MAX_PLAYER; i < e; i++) {
    obj = model.co_data[i];

    // persist the data as array if target player isn't active then use a `0` as data
    if (model.player_data[i].team === INACTIVE_ID) {
      data.push(0);
    } else {
      data.push([
        obj.power,
        obj.timesUsed,
        obj.level,
        obj.coA,
        obj.coB
      ]);
    }
  }

  dom.co = data;

  // ---------------------------------------------

  dom.cfg = {};
  keys = cwt.Config.registeredNames_;
  for (i = 0, e = keys.length; i < e; i++) {
    dom.cfg[keys[i]] = cwt.Config.getValue(keys[i]);
  };

  // ---------------------------------------------

  dom.trOw = cwt.Gameround.turnOwner;
  dom.day = cwt.Gameround.day;

  // ---------------------------------------------

  dom.gmTm = cwt.Gameround.gameTimeElapsed;
  dom.tnTm = cwt.Gameround.turnTimeElapsed;

  // ---------------------------------------------

  return JSON.stringify(dom);
};