/**
 * Retusn a list of loaded unit ids by a given transporter id.
 *
 * @param tid
 */
model.getLoadedIds = function( tid ){
  var loaded = [];
  var pid = model.units[ tid ].owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        loaded.push( i );
      }
    }
  }

  return loaded;
};

/**
 * Has a transporter unit with id tid loaded units? Returns true if yes, else
 * false.
 *
 * @param tid
 */
model.hasLoadedIds = function( tid ){
  var pid = model.units[ tid ].owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns true if the unit with the id lid is loaded by a transporter unit
 * with id tid.
 *
 * @param lid
 * @param tid
 */
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param lid
 * @param tid
 */
model.loadUnitInto = function( lid, tid ){
  if( !model.canLoad( lid,tid ) ){
    util.logError("transporter unit",tid,"cannot load unit",lid);
  }

  model.units[ lid ].loadedIn = tid;
};

/**
 * Unloads the unit with id lid from a tranporter with the id tid.
 *
 * @param lid
 * @param tid
 */
model.unloadUnitFrom = function( lid, tid ){
  model.units[ lid ].loadedIn = -1;
};

/**
 * Returns true if a tranporter with id tid can load the unit with the id
 * lid. This function also calculates the resulting weight if the transporter
 * would load the unit. If the calculated weight is greater than the maxiumum
 * loadable weight false will be returned.
 *
 * @param lid
 * @param tid
 */
model.canLoad = function( lid, tid ){
  var tp = model.units[ tid ];
  var lu = model.units[ lid ];

  // CALCULATE CURRENT LOADED WEIGHT
  var cW = 0;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*tp.owner,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ){
        cW += model.sheets.unitSheets[ model.units[ i ].type ].weight;
      }
    }
  }

  // CALCULATE FUTURE WEIGHT
  cW += model.sheets.unitSheets[ lu.type ].weight;

  var tps = model.sheets.unitSheets[ tp.type ].transport;
  if( cW > tps.maxWeight ) return false;

  // IS UNIT TYPE LOADABLE
  var unitSh = model.sheets.unitSheets[ model.units[ lid ].type ];
  var tpsL = tps.canLoad;

  // ID
  if( tpsL.indexOf( model.units[ lid ].type ) !== -1 ) return true;

  // MOVETYPE
  if( tpsL.indexOf( unitSh.moveType ) !== -1 ) return true;

  // ALL TYPE
  if( tpsL.indexOf("*") !== -1 ) return true;

  return false;
};

/**
 * Returns true if the unit with id tid is a traensporter, else false.
 *
 * @param tid
 */
model.isTransport = function( tid ){
  return model.sheets.unitSheets[
    model.units[ tid ].type ].transport !== undefined;
};
