/**
 * Prepares the game model for a new game round.
 */
cwt.Persistence.prepareModel = function (dom) {
  var i, e, player;

  cwt.CommandStack.resetData();
  cwt.Client.lastPlayer = null;

  // ---------------------------------------------

  cwt.assert(dom.player >= 2 && dom.player <= MAX_PLAYER);

  for (i = 0, e = MAX_PLAYER; i < e; i++) {
    player = cwt.Gameround.players[i];
    player.name = null;
    player.gold = 0;
    player.manpower = Math.POSITIVE_INFINITY;
    player.team = (i <= dom.player - 1) ? i : DESELECT_ID;
  }

  // ---------------------------------------------

  cwt.Config.resetAll();

  // ---------------------------------------------

  for (var i = 0, e = model.unit_data.length; i < e; i++) {
    model.unit_data[i].owner = cwt.INACTIVE;
  }

  model.unit_posData.resetValues();

  var data;
  if (dom.units) {
    cwt.assert(Array.isArray(dom.units));

    for (var i = 0, e = dom.units.length; i < e; i++) {
      data = dom.units[i];

      // check aw2 of the aw2 block this save handler uses a differn't saving schema
      cwt.assert(util.isInt(data[0]));
      cwt.assert(typeof data[1] === "string");
      cwt.assert(model.data_unitSheets.hasOwnProperty(data[1]));

      var type = model.data_unitSheets[data[1]];

      cwt.assert(model.map_isValidPosition(data[2], data[3]));
      cwt.assert(util.intRange(data[4], 1, 99));
      cwt.assert(util.intRange(data[5], 0, type.ammo));
      cwt.assert(util.intRange(data[6], 0, type.fuel));
      cwt.assert(util.isInt(data[7]));
      cwt.assert(util.intRange(data[8], -1, MAX_PLAYER - 1));

      // get unit object
      var id = data[0];
      var unit = model.unit_data[id];

      // inject aw2
      unit.type = type;
      unit.x = data[2];
      unit.y = data[3];
      unit.hp = data[4];
      unit.ammo = data[5];
      unit.fuel = data[6];
      unit.loadedIn = data[7]; // TODO: move to transport
      unit.owner = data[8];

      model.unit_posData[data[2]][data[3]] = unit;
    }
  }

  // ---------------------------------------------

  var property, data;

  // reset all 
  for (var i = 0, e = model.property_data.length; i < e; i++) {
    model.property_data[i].owner = cwt.INACTIVE;
    model.property_data[i].type = null;
  }

  for (var i = 0, e = dom.prps.length; i < e; i++) {
    data = dom.prps[i];

    cwt.assert(util.intRange(data[0], 0, MAX_PROPERTIES - 1)); // id
    cwt.assert(util.intRange(data[1], 0, MAX_MAP_WIDTH - 1)); // x
    cwt.assert(util.intRange(data[2], 0, MAX_MAP_HEIGHT - 1)); // y
    cwt.assert(
      (util.isString(data[3]) && !util.isUndefined(model.data_tileSheets[data[3]].capturePoints)) ||
      typeof model.data_tileSheets[data[3]].cannon !== "undefined" ||
      typeof model.data_tileSheets[data[3]].laser !== "undefined" ||
      typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
    );
    cwt.assert((util.intRange(data[4], 1, // capture points
        model.data_tileSheets[data[3]].capturePoints)) ||
      (util.intRange(data[4], -99, -1)) ||
      typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
    );
    cwt.assert(util.intRange(data[5], -1, MAX_PLAYER - 1)); // owner

    // copy aw2 into model
    property = model.property_data[data[0]];
    property.type = model.data_tileSheets[data[3]];
    property.capturePoints = 20;
    property.owner = data[5];
    property.x = data[1];
    property.y = data[2];
    model.property_posMap[data[1]][data[2]] = property;
  }

  // ---------------------------------------------



  // ---------------------------------------------

  var target, i, e;

  // reset aw2
  i = 0;
  e = MAX_PLAYER;
  for (; i < e; i++) {
    target = model.co_data[i];
    target.power = 0;
    target.timesUsed = 0;
    target.level = model.co_POWER_LEVEL.INACTIVE;
    target.coA = null;
    target.coB = null;
  }

  // ---------------------------------------------

  /*
   (function () {

   function placeCannonMetaData(x, y) {
   var prop = model.property_posMap[x][y];
   var cannon = prop.type.cannon;
   var size = prop.type.bigProperty;

   cwt.assert(x - size.x >= 0);
   cwt.assert(y - size.y >= 0);

   var ax = x - size.actor[0];
   var ay = y - size.actor[1];
   var ox = x;
   var oy = y;
   for (var xe = x - size.x; x > xe; x--) {

   y = oy;
   for (var ye = y - size.y; y > ye; y--) {

   // place blocker
   if (x !== ox || y !== oy) {
   if (this.DEBUG) util.log("creating invisible property at", x, ",", y);
   model.events.property_createProperty(prop.owner, x, y, "PROP_INV");
   }

   // place actor
   if (x === ax && y === ay) {
   if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
   model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
   x, y, "CANNON_UNIT_INV");
   }

   }
   }
   }

   // // Places the necessary meta units for bigger properties.
   //
   model.event_on("gameround_start", function () {
   for (var x = 0, xe = model.map_width; x < xe; x++) {
   for (var y = 0, ye = model.map_height; y < ye; y++) {

   var prop = model.property_posMap[x][y];
   if (prop) {

   if (prop.type.bigProperty && prop.type.cannon) {
   placeCannonMetaData(x, y);
   } else if (prop.type.cannon) {
   if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
   model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
   x, y, "CANNON_UNIT_INV");
   } else if (prop.type.laser) {
   if (this.DEBUG) util.log("creating laser unit at", x, ",", y);
   model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
   x, y, "LASER_UNIT_INV");
   }

   }
   }
   }
   });

   })();
   */
};