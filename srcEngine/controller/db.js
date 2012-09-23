/** @private */
cwt._dbAmanda = null;

/** @private */
cwt._unitSheets = {};

/** @private */
cwt._tileSheets = {};

/** @private */
cwt._weaponSheets = {};

/** @private */
cwt._weatherSheets = {};

/** @private */
cwt._movetypeSheets = {};

cwt.UNIT_TYPE_SHEET = 0;
cwt.TILE_TYPE_SHEET = 1;
cwt.WEAPON_TYPE_SHEET = 2;
cwt.WEATHER_TYPE_SHEET = 3;
cwt.MOVE_TYPE_SHEET = 4;

cwt.onInit( "db", function(){
  cwt._dbAmanda = amanda("json");
});

/**
 * Different sheet validators.
 *
 * @namespace
 */
cwt.typeSheetValidators = {

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
      ID: { type:'string', except:[], required:true }
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
 * Returns a unit type by its id.
 *
 * @param id
 */
cwt.unitSheet = function(id){
  if( !cwt._unitSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._unitSheets[id];
};

/**
 * Returns a tile type by its id.
 *
 * @param id
 */
cwt.tileSheet = function(id){
  if( !cwt._tileSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._tileSheets[id];
};

/**
 * Returns a move type by its id.
 *
 * @param id
 */
cwt.movetypeSheet = function(id){
  if( !cwt._movetypeSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id); }

  return cwt._movetypeSheets[id];
};

/**
 * Returns a weapon type by its id.
 *
 * @param id
 */
cwt.weaponSheet = function(id){
  if( !cwt._weaponSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._weaponSheets[id];
};

/**
 * Returns a weather type by its id.
 *
 * @param id
 */
cwt.weatherSheet = function(id){
  if( !cwt._weatherSheets.hasOwnProperty(id) ){
    cwt.error("unknown id "+id);
  }

  return cwt._weatherSheets[id];
};

/**
 * Parses a data object into the database. The data object must be
 * a valid javascript object. The type decide what kind of the the
 * data object is.
 */
cwt.parseSheet = function( data, type ){
  var schema, db, excList;
  var id = data.ID;

  // find schema and data list
  switch( type ){

    case cwt.UNIT_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.unitValidator;
      db = cwt._unitSheets;
      excList = cwt.typeSheetValidators.unitValidator.properties.ID.except;
      break;

    case cwt.TILE_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.tileValidator;
      db = cwt._tileSheets;
      excList = cwt.typeSheetValidators.tileValidator.properties.ID.except;
      break;

    case cwt.WEAPON_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.weaponValidator;
      db = cwt._weaponSheets;
      excList = cwt.typeSheetValidators.weaponValidator.properties.ID.except;
      break;

    case cwt.WEATHER_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.weatherValidator;
      db = cwt._weatherSheets;
      excList = cwt.typeSheetValidators.weatherValidator.properties.ID.except;
      break;

    case cwt.MOVE_TYPE_SHEET:
      schema =  cwt.typeSheetValidators.movetypeValidator;
      db = cwt._movetypeSheets;
      excList = cwt.typeSheetValidators.movetypeValidator.properties.ID.except;
      break;

    default: cwt.error("unknow type {0}",type);
  }

  cwt._dbAmanda.validate( data, schema, function(e){
    if( e ){
      cwt.error( "failed to parse sheet due {0}", e.getMessages() );
      throw Error( e );
    }
  });

  if( db.hasOwnProperty(id) ) cwt.error("{0} is already registered",id);
  db[id] = data;

  // register id in exception list
  excList.push(id);
};