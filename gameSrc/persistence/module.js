cwt.Persistence = {

  //
  //
  IOS7_WEBSQL_BUGFIX_SIZE: 4,

  //
  //
  DEFAULT_DB_SIZE: 50,

  //
  //
  MAPPING_STORAGE_KEY: "__user_key_map__",

  //
  // @type {Array}
  //
  mapNames_: null,

  // Storage object which allows to save and load data peristent in the users web browser.
  //
  storage: {

    get: function(key, cb) {
      localforage.getItem(key, cb);
    },

    // Saves a value with a given key. If the key exists, then the old value will be overwritten. After the
    // save process, the callback cb will be invoked.
    //
    set: function(key, value, cb) {
      localforage.setItem(key, value, function(res, error) {

        // try a second time when fail at the first time because on ios the question
        // for more storage invokes an error => we don't want to need to reload then
        if (error) {
          localforage.setItem(key, value, cb);
        } else {
          cb(res);
        }
      });
    },

    keys: function(cb) {
      localforage.keys(cb);
    },

    clear: function(cb) {
      localforage.clear(cb);
    },

    remove: function(key, cb) {
      localforage.removeItem(key, cb);
    }
  },

  $beforeLoad: function() {
    localforage.config({
      name: "CWT_DATABASE",
      size: (cwt.ClientFeatures.iosWebSQLFix ? this.IOS7_WEBSQL_BUGFIX_SIZE : this.DEFAULT_DB_SIZE) * 1024 * 1024
    });
  },

  $afterLoad: function() {
    var pers = this;

    // grab map list from storage
    pers.keys(function(keys) {
      pers.mapNames_ = keys;
      if (callback) {
        callback();
      }
    });
  },

  // ----

  saveGame: function() {
    var that = cwt.Map;
    data.mpw = this.width;
    data.mph = this.height;
    data.map = [];
    data.prps = [];
    data.units = [];

    // generates ID map
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for (var x = 0, xe = that.width; x < xe; x++) {

      data.map[x] = [];
      for (var y = 0, ye = that.height; y < ye; y++) {
        var type = that.data[x][y].type.ID;

        // create number for type
        if (!mostIdsMap.hasOwnProperty(type)) {
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }

        data.map[x][y] = mostIdsMap[type];

        // save property
        var prop = that.data[x][y].property;
        if (prop) {
          data.prps.push([
            cwt.Property.getInstanceId(prop),
            x,
            y,
            prop.type.ID,
            prop.capturePoints,
            prop.owner.id
          ]);
        }

        // save unit
        var unit = that.data[x][y].unit;
        if (unit) {
          data.units.push([
            cwt.Unit.getInstanceId(unit),
            unit.type.ID,
            x,
            y,
            unit.hp,
            unit.ammo,
            unit.fuel,
            unit.loadedIn,
            unit.owner.id,
            unit.canAct,
            unit.hidden
          ]);
        }
      }
    }

    // generate type map
    data.typeMap = [];
    var typeKeys = Object.keys(mostIdsMap);
    for (var i = 0, e = typeKeys.length; i < e; i++) {
      data.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
    }

    data.wth = this.weather.ID;
    data.trOw = this.turnOwner.id;
    data.day = this.day;
    data.gmTm = this.gameTimeElapsed;
    data.tnTm = this.turnTimeElapsed;

    data.cfg = {};
    for (var i = 0, e = this.MULTITON_NAMES.length; i < e; i++) {
      var key = this.MULTITON_NAMES[i];
      data.cfg[key] = cwt.Config.getValue(key);
    }
  },

  loadGame: function(gameData, isSave) {
    var that = cwt.Map;

    var property;
    var unit;
    var player;

    that.width = data.mpw;
    that.height = data.mph;

    // map
    for (var x = 0, xe = that.width; x < xe; x++) {
      for (var y = 0, ye = that.height; y < ye; y++) {
        that.data[x][y].type = cwt.TileSheet.sheets[data.typeMap[data.map[x][y]]];
      }
    }

    // prepare properties
    for (var i = 0, e = cwt.Property.MULTITON_INSTANCES; i < e; i++) {
      property = cwt.Property.getInstance(i, true);
      if (property) {
        property.owner = null;
        property.type = null;
        property.capturePoints = 20;
      }
    }

    // saved properties
    cwt.assert(Array.isArray(data.prps));
    for (var i = 0, e = data.prps.length; i < e; i++) {
      var propData = data.prps[i];

      // check_ map data
      cwt.assert(propData[0] >= 0 && propData[0] < cwt.Property.MULTITON_INSTANCES);
      cwt.assert(propData[1] >= 0 && propData[1] < that.width);
      cwt.assert(propData[2] >= 0 && propData[2] < that.height);
      cwt.assert(cwt.PropertySheet.sheets.hasOwnProperty(propData[3]));
      cwt.assert(propData[5] >= -1 && propData[5] < cwt.Player.MULTITON_INSTANCES);

      //cwt.assert(
      //  (util.isString(propData[3]) && !util.isUndefined(model.data_tileSheets[propData[3]].capturePoints)) ||
      //    typeof model.data_tileSheets[propData[3]].cannon !== "undefined" ||
      //    typeof model.data_tileSheets[propData[3]].laser !== "undefined" ||
      //    typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
      //);

      //cwt.assert((util.intRange(propData[4], 1, // capture points
      //  model.data_tileSheets[propData[3]].capturePoints)) ||
      // (util.intRange(propData[4], -99, -1)) ||
      //  typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
      //);

      // copy data into model
      property = cwt.Property.getInstance(propData[0]);
      property.type = cwt.PropertySheet.sheets[propData[3]];
      property.capturePoints = propData[4];
      property.owner = (propData[5] != cwt.INACTIVE) ? cwt.Player.getInstance(propData[5]) : null;
      that.data[propData[1]][propData[2]].property = property;
    }

    // prepare units
    cwt.assert(Array.isArray(data.units));
    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      unit = cwt.Unit.getInstance(i, true);
      if (unit) {
        unit.owner = null;
      }
    }

    // saved units
    for (var i = 0, e = data.units.length; i < e; i++) {
      var unitData = data.units[i];

      // check_ map data
      cwt.assert(unitData[0] >= 0 && unitData[0] < cwt.Unit.MULTITON_INSTANCES);
      cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(unitData[1]));
      cwt.assert(that.isValidPosition(unitData[2], unitData[3]));
      cwt.assert(unitData[4] >= 1 && unitData[4] <= 99);

      var type = cwt.UnitSheet.sheets[unitData[1]];
      cwt.assert(unitData[5] >= 0 && unitData[5] <= type.ammo);
      cwt.assert(unitData[6] >= 0 && unitData[6] <= type.fuel);
      cwt.assert(typeof unitData[7] === "number");
      cwt.assert(unitData[8] >= -1 && unitData[8] < cwt.Player.MULTITON_INSTANCES);
      cwt.assert(unitData.length < 10 || typeof unitData[9] === "boolean");
      cwt.assert(unitData.length < 11 || typeof unitData[10] === "boolean");

      // copy data into model
      unit = cwt.Unit.getInstance(unitData[0]);
      unit.type = type;
      unit.hp = unitData[4];
      unit.ammo = unitData[5];
      unit.fuel = unitData[6];
      unit.loadedIn = (unitData[7] != cwt.INACTIVE) ? cwt.Unit.getInstance(unitData[7]) : null;
      unit.owner = cwt.Player.getInstance(unitData[8]);
      unit.canAct = (typeof unitData[9] === "boolean") ? unitData[9] : false;
      unit.hidden = (typeof unitData[10] === "boolean") ? unitData[10] : false;
      that.data[unitData[2]][unitData[3]].unit = unit;
    }

    // reset player data
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var player = cwt.Player.getInstance(i);
      player.name = null;
      player.gold = 0;
      player.manpower = Math.POSITIVE_INFINITY;
      player.team = (i <= data.player - 1) ? i : cwt.NOT_AVAILABLE;
    }

    // grab save game data
    if (isSave) {
      for (var i = 0, e = data.players.length; i < e; i++) {
        var playerData = data.players[i];

        // check_ data
        cwt.assert(playerData[0] >= 0 && playerData[0] < cwt.Player.MULTITON_INSTANCES);
        cwt.assert(typeof playerData[1] === "string");
        cwt.assert(playerData[3] >= 0 && playerData[3] < cwt.Player.MULTITON_INSTANCES);
        cwt.assert(playerData[2] >= 0 && playerData[2] < 999999);
        cwt.assert(playerData[4] >= 0 && playerData[4] < 999999);

        // set player data
        var player = cwt.Player.getInstance(playerData[0]);
        player.name = playerData[1];
        player.gold = playerData[2];
        player.team = playerData[3];
        player.manpower = playerData[4];
      }
    }
    this.weather = cwt.WeatherSheet.defaultWeather;
    this.turnOwner = cwt.Player.getInstance(0);
    this.day = 0;

    if (isSave) {
      cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(data.wth));
      cwt.assert(data.trOw >= 0 && data.trOw < 9999999);
      cwt.assert(data.day >= 0 && data.day < 9999999);
      cwt.assert(data.gmTm >= 0);
      cwt.assert(data.tnTm >= 0);

      this.weather = cwt.WeatherSheet.sheets[data.wth];
      this.turnOwner = cwt.Player.getInstance(data.trOw);
      this.day = data.day;
      this.gameTimeElapsed = data.gmTm;
      this.turnTimeElapsed = data.tnTm;
    }

    cwt.Config.resetAll();
    if (isSave && data.cfg) {
      for (var i = 0, e = this.MULTITON_NAMES.length; i < e; i++) {
        var key = this.MULTITON_NAMES[i];
        if (data.cfg[key]) {
          cwt.Config.getConfig(key).setValue(data.cfg[key]);
        }
      }
    }
  },

  // ----

  saveAssets: function() {

  },

  loadAssets: function() {

  },

  // ----

  //
  // @constant
  //
  PARAM_WIPEOUT: "cwt_resetData",

  //
  // @constant
  //
  PARAM_FORCE_TOUCH: "cwt_forceTouch",

  //
  // @constant
  //
  PARAM_ANIMATED_TILES: "cwt_animatedTiles",

  saveAppConfigs: function(cb) {
    this.storage.set(this.PARAM_ANIMATED_TILES, cwt.Config.getValue("animatedTiles") === 1, function() {
      this.storage.set(this.PARAM_FORCE_TOUCH, cwt.Config.getValue("forceTouch") === 1, function() {
        if (cb) {
          cb();
        }
      });
    });
  },

  loadAppConfigs: function(cb) {
    this.storage.get(this.PARAM_ANIMATED_TILES, function(obj) {
      if (obj) {
        cwt.Config.getConfig("animatedTiles").setValue(obj.value ? 1 : 0);
      }

      this.storage.get(this.PARAM_FORCE_TOUCH, function(obj) {
        if (obj) {
          cwt.Config.getConfig("forceTouch").setValue(obj.value ? 1 : 0);
        }

        if (cb) {
          cb();
        }
      });
    });
  },

  // ----

  //
  // Saves the current active input mapping into the user storage.
  //
  saveKeyMapping: function() {
    this.storage.set(
      this.MAPPING_STORAGE_KEY,

      // extract custom mapping
      {
        keyboard: cwt.Input.types.keyboard.MAPPING,
        gamePad: cwt.Input.types.gamePad.MAPPING
      },

      function() {
        if (cwt.DEBUG) {
          console.log("successfully saved user input mapping");
        }
      }
    );
  },

  //
  // Loads the keyboard input mapping from the user storage. If no
  // user input setting will be found then the default mapping will
  // be used.
  //
  loadKeyMapping: function(cb) {
    this.storage.get(
      this.MAPPING_STORAGE_KEY,

      function(obj) {
        if (obj && obj.value) {
          if (cwt.DEBUG) {
            console.log("loading custom key configuration");
          }

          // inject custom mapping
          if (obj.value.keyboard) {
            cwt.Input.types.keyboard.MAPPING = obj.value.keyboard;
          }

          if (obj.value.gamePad) {
            cwt.Input.types.gamePad.MAPPING = obj.value.gamePad;
          }
        }

        // call callback
        if (cb) {
          cb(obj != null);
        }
      }
    );
  },

  // ----

  grabFromLive: function(callback) {
    var stuff = [];

    Object.keys(cwt.mapList).forEach(function(key) {
      stuff.push(function(next) {
        grabRemoteFile({
          path: cwt.MOD_PATH + cwt.Persistence.mapNames_[key],
          json: true,

          error: function(msg) {
            throw Error("could not load map");
          },

          success: function(resp) {
            this.storage.set(key, resp, function() {
              next();
            });
          }
        });
      });
    });

    callAsSequence(stuff, function() {
      delete cwt.Maps.grabFromLive;
      callback();
    });
  },

  loadMap: function(path, callback) {
    this.storage.get(path, function(obj) {
      callback(path, obj.value);
    });
  }

};


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
//*/
