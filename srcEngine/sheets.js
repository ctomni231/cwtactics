sheets._dbAmanda = amanda("json");

/** @constant */
sheets.UNIT_TYPE_SHEET = 0;

/** @constant */
sheets.TILE_TYPE_SHEET = 1;

/** @constant */
sheets.WEAPON_TYPE_SHEET = 2;

/** @constant */
sheets.WEATHER_TYPE_SHEET = 3;

/** @constant */
sheets.MOVE_TYPE_SHEET = 4;

/**
 * Holds all known unit sheets.
 */
sheets.units = {};

/**
 * Holds all known tile sheets.
 */
sheets.tiles = {};

/**
 * Holds all known weapon sheets.
 */
sheets.weapons = {};

/**
 * Holds all known weather sheets.
 */
sheets.weathers = {};

/**
 * Holds all known move type sheets.
 */
sheets.movetypes = {};

/**
 * Different sheet validators.
 *
 * @namespace
 */
sheets.typeSheetValidators = {

  /** Schema for an unit sheet. */
  unitValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true },
      cost: { type:'integer', minimum:0 },
      fuelConsumption: { type:'integer', minimum:0 },
      maxAmmo: { type:'integer', minimum:0, maximum:99 },
      maxFuel: { type:'integer', minimum: 0, maximum:99, required:true },
      moveRange: { type:'integer', minimum: 0, maximum:15, required:true },
      moveType: { type:'string', required:true },
      weight: { type:'integer', required:true }
    }
  },

  /** Schema for a tile sheet. */
  tileValidator: {
    type: 'object',
    properties: {
      ID: { type:'string', except:[], required:true },
      capturePoints: { type:'integer', minimum: 1, maximum:99 },
      defense: { type:'integer', minimum: 0, maximum:5 }
    }
  },

  /** Schema for a weapon sheet. */
  weaponValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true },
      noMoveAndFire: { type:'boolean' }
    }
  },

  /** Schema for a weather sheet. */
  weatherValidator: {
    type: 'object',
    properties:{
      ID: { type:'string', except:[], required:true }
    }
  },

  /** Schema for a move type sheet. */
  movetypeValidator: {
    type: 'object',
    properties: {
      ID: { type:'string', except:[], required:true },
      costs: {
        type: "object",
        patternProperties: {
          '[.]*': { type:"integer", minimum:0 } }
      }
    }
  }
};

/**
 * Parses a data object into the database. The data object must be
 * a valid javascript object. The type decide what kind of the the
 * data object is.
 */
sheets.parseSheet = function( data, type ){
  var schema, db, excList;
  var id = data.ID;

  // FIND SCHEMA AND DATA LIST
  switch( type ){

    case sheets.UNIT_TYPE_SHEET:
      schema =  sheets.typeSheetValidators.unitValidator;
      db = sheets.units;
      excList = sheets.typeSheetValidators.unitValidator.properties.ID.except;
      break;

    case sheets.TILE_TYPE_SHEET:
      schema =  sheets.typeSheetValidators.tileValidator;
      db = sheets.tiles;
      excList = sheets.typeSheetValidators.tileValidator.properties.ID.except;
      break;

    case sheets.WEAPON_TYPE_SHEET:
      schema =  sheets.typeSheetValidators.weaponValidator;
      db = sheets.weapons;
      excList = sheets.typeSheetValidators.weaponValidator.properties.ID.except;
      break;

    case sheets.WEATHER_TYPE_SHEET:
      schema =  sheets.typeSheetValidators.weatherValidator;
      db = sheets.weathers;
      excList = sheets.typeSheetValidators.weatherValidator.properties.ID.except;
      break;

    case sheets.MOVE_TYPE_SHEET:
      schema =  sheets.typeSheetValidators.movetypeValidator;
      db = sheets.movetypes;
      excList = sheets.typeSheetValidators.movetypeValidator.properties.ID.except;
      break;

    default: cwt.error("unknow type {0}",type);
  }

  // CHECK IDENTICAL STRING FIRST
  if( db.hasOwnProperty(id) ) cwt.error("{0} is already registered",id);

  // VALIDATE SHEET
  sheets._dbAmanda.validate( data, schema, function(e){
    if( e ) cwt.error( "failed to parse sheet due {0}", e.getMessages() );
  });

  db[id] = data;

  // REGISTER ID IN EXCEPTION LIST
  excList.push(id);
};

/**
 * Returns a unit type by its id.
 *
 * @param id
 */
game.unitSheet = function(id){
  if( !sheets.units.hasOwnProperty(id) ){
    util.logError("unknown id",id);
  }

  return sheets.units[id];
};

/**
 * Returns a tile type by its id.
 *
 * @param id
 */
game.tileSheet = function(id){
  if( !sheets.tiles.hasOwnProperty(id) ){
    util.logError("unknown id",id);
  }

  return sheets.tiles[id];
};

/**
 * Returns a move type by its id.
 *
 * @param id
 */
game.movetypeSheet = function(id){
  if( !sheets.movetypes.hasOwnProperty(id) ){
    util.logError("unknown id",id); }

  return sheets.movetypes[id];
};

/**
 * Returns a weapon type by its id.
 *
 * @param id
 */
game.weaponSheet = function(id){
  if( !sheets.weapons.hasOwnProperty(id) ){
    util.logError("unknown id",id);
  }

  return sheets.weapons[id];
};

/**
 * Returns a weather type by its id.
 *
 * @param id
 */
game.weatherSheet = function(id){
  if( !sheets.weathers.hasOwnProperty(id) ){
    util.logError("unknown id",id);
  }

  return sheets.weathers[id];
};

/**
 * Returns all known type sheets of units.
 */
game.getListOfUnitTypes = function(){
  return Object.keys( sheets.units );
};

/**
 * Returns all known type sheets of properties.
 */
game.getListOfPropertyTypes = function(){
  var l = Object.keys( sheets.tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( sheets.tiles[l[i]].capturePoints > 0 ){
      r.push( l[i] );
    }
  }
  return r;
};

/**
 * Returns all known type sheets of tiles.
 */
game.getListOfTileTypes = function(){
  var l = Object.keys( sheets.tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( sheets.tiles[l[i]].capturePoints === undefined ){
      r.push( l[i] );
    }
  }
  return r;
};