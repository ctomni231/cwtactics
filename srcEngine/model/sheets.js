model.sheets = {};

model.sheets._dbAmanda = amanda("json");

/** @constant */
model.sheets.UNIT_TYPE_SHEET = 0;

/** @constant */
model.sheets.TILE_TYPE_SHEET = 1;

/** @constant */
model.sheets.WEAPON_TYPE_SHEET = 2;

/** @constant */
model.sheets.WEATHER_TYPE_SHEET = 3;

/** @constant */
model.sheets.MOVE_TYPE_SHEET = 4;

/** @constant */
model.sheets.RULESET = 5;

/** @constant */
model.PRIMARY_WEAPON_TAG = "mainWeapon";

/** @constant */
model.SECONDARY_WEAPON_TAG = "subWeapon";

/**
 * Holds all known unit game.
 */
model.sheets.unitSheets = {};

/**
 * Holds all known tile game.
 */
model.sheets.tileSheets = {};

/**
 * Holds all known weapon game.
 */
model.sheets.weaponSheets = {};

/**
 * Holds all known weather game.
 */
model.sheets.weatherSheets = {};

/**
 * Holds all known move type game.
 */
model.sheets.movetypeSheets = {};

/**
 * Contains the loaded modification rules.
 */
model.sheets.defaultRules = null;

/**
 * Different sheet validators.
 *
 * @namespace
 */
model.sheets.typeSheetValidators = {

  rulesValidator: {
    type: 'object',
    properties:{
      funds:            { type:'integer', minimum:0, maximum:99999 },
      noUnitsLeftLoose: { type:'boolean' },
      captureWinLimit:  { type:'integer', minimum:0, maximum:99999 },
      turnTimeLimit:    { type:'integer', minimum:0, maximum:3600000 },
      dayLimit:         { type:'integer', minimum:0, maximum:99999 },
      unitLimit:        { type:'integer', minimum:1, maximum:50    },
      blockedUnits:     { type:'array' }
    }
  },

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

// DO NOT SERIALIZE SHEETS
model.sheets.toJSON = function(){ return undefined; }

/**
 * Parses a data object into the database. The data object must be
 * a valid javascript object. The type decide what kind of the the
 * data object is.
 */
model.parseSheet = function( data, type ){
  var schema, db, excList;
  var id = data.ID;
  var validators = model.sheets.typeSheetValidators;

  // FIND SCHEMA AND DATA LIST
  switch( type ){

    case model.sheets.UNIT_TYPE_SHEET:
      schema =  validators.unitValidator;
      db = model.sheets.unitSheets;
      excList = validators.unitValidator.properties.ID.except;
      break;

    case model.sheets.TILE_TYPE_SHEET:
      schema =  validators.tileValidator;
      db = model.sheets.tileSheets;
      excList = validators.tileValidator.properties.ID.except;
      break;

    case model.sheets.WEAPON_TYPE_SHEET:
      schema =  validators.weaponValidator;
      db = model.sheets.weaponSheets;
      excList = validators.weaponValidator.properties.ID.except;
      break;

    case model.sheets.WEATHER_TYPE_SHEET:
      schema =  validators.weatherValidator;
      db = model.sheets.weatherSheets;
      excList = validators.weatherValidator.properties.ID.except;
      break;

    case model.sheets.MOVE_TYPE_SHEET:
      schema =  validators.movetypeValidator;
      db = model.sheets.movetypeSheets;
      excList = validators.movetypeValidator.properties.ID.except;
      break;

    case model.sheets.RULESET:
      schema =  validators.rulesValidator;
      break;

    default: util.logError("unknow type",type);
  }

  // CHECK IDENTICAL STRING FIRST
  if( type !== model.sheets.RULESET &&
    db.hasOwnProperty(id) ) util.logError(id,"is already registered");

  // VALIDATE SHEET
  model.sheets._dbAmanda.validate( data, schema, function(e){
    if( e ) util.logError( "failed to parse sheet due", e.getMessages() );
  });

  if( type === model.sheets.RULESET ) model.sheets.defaultRules = data;
  else{
    db[id] = data;

    // REGISTER ID IN EXCEPTION LIST
    excList.push(id);
  }

};

/**
 * Returns all known type game of units.
 */
model.getListOfUnitTypes = function(){
  return Object.keys( model.sheets.unitSheets );
};

/**
 * Returns all known type game of properties.
 */
model.getListOfPropertyTypes = function(){
  var tiles = model.sheets.tileSheets;
  var l = Object.keys( tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( tiles[l[i]].capturePoints > 0 ){
      r.push( l[i] );
    }
  }
  return r;
};

/**
 * Returns all known type game of tiles.
 */
model.getListOfTileTypes = function(){
  var tiles = model.sheets.tileSheets;
  var l = Object.keys( tiles );
  var r = [];
  for( var i=l.length-1; i>=0; i-- ){
    if( tiles[l[i]].capturePoints === undefined ){
      r.push( l[i] );
    }
  }
  return r;
};

/**
 *
 * @param unit
 */
model.primaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.illegalArgumentError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.PRIMARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 *
 * @param unit
 */
model.secondaryWeaponOfUnit = function( unit ){
  if( DEBUG && unit === null ) util.illegalArgumentError();

  if( typeof unit === 'number' ){
    unit = model.units[unit];
  }

  var type = model.sheets.unitSheets[ unit.type ][ model.SECONDARY_WEAPON_TAG ];
  return (type !== undefined )? model.sheets.weaponSheets[ type ] : null;
};

/**
 * Returns the base damage from a weapon sheet against an unit type.
 *
 * @param weapon weapon sheet
 * @param uType {string} unit type
 */
model.getBaseDamage = function( weapon, uType ){
  if( DEBUG && weapon === null ) util.illegalArgumentError();
  if( DEBUG && uType === null ) util.illegalArgumentError();

  var dmg;

  dmg = weapon.damages[ uType ];
  if( dmg !== undefined ) return dmg;

  dmg = weapon.damages[ "*" ];
  if( dmg !== undefined ) return dmg;

  return 0;
};

/**
 * Returns the costs for a movetype to move onto a tile type.
 *
 * @param movetype
 * @param tiletype
 */
model.moveCosts = function( movetype, tiletype ){
  var c;

  // search id
  c = movetype.costs[ tiletype ];

  if( c === undefined ) c = movetype.costs["*"];

  return c;
};