/**
 * Saves the game model into a JSON compatible
 * data format.
 */
cwt.Persistence.saveModel = function () {
  var dom = {};
  var arr, keys;

  // ---------------------------------------------


  // ---------------------------------------------

  var unit;

  dom.units = [];
  for (var i = 0, e = model.unit_data.length; i < e; i++) {
    unit = model.unit_data[i];

    if (unit.owner !== cwt.INACTIVE) {
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
    if (prop.owner !== cwt.INACTIVE) {
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


  // ---------------------------------------------

  // result document model for co aw2 will be a matrix
  var data = [];
  var obj;

  for (var i = 0, e = MAX_PLAYER; i < e; i++) {
    obj = model.co_data[i];

    // persist the aw2 as array if target player isn't active then use a `0` as aw2
    if (model.player_data[i].team === cwt.INACTIVE) {
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

};