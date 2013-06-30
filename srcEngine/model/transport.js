/**
 * Has a transporter unit with id tid loaded units? Returns true if yes, else
 * false.
 *
 * @param {Number} tid transporter id
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
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.loadUnitInto = function( loadId, transportId ){
  if( !model.canLoad( loadId, transportId ) ){
    util.raiseError("transporter unit",transportId,"cannot load unit",loadId);
  }

  model.units[ loadId ].loadedIn = transportId;
  model.units[ transportId ].loadedIn--;
};

/**
 * Unloads the unit with id lid from a tranporter with the id tid.
 *
 * @param {Number} lid
 * @param {Number} tid
 */
model.unloadUnitFrom = function( transportId, trsx, trsy, loadId, tx,ty ){
  
  // TRAPPED ?
  if( tx === -1 || ty === -1 ) return;

  // SEND LOADED UNIT INTO WAIT
  model.units[ loadId ].loadedIn = -1;
  model.units[ transportId ].loadedIn++;

  var moveCode;
  if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
  else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
  else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
  else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;

  // MOVE OUT
  model.moveUnit([moveCode], loadId, trsx, trsy);
  model.markUnitNonActable( loadId );
};

/**
 * Returns true if a tranporter with id tid can load the unit with the id
 * lid. This function also calculates the resulting weight if the transporter
 * would load the unit. If the calculated weight is greater than the maxiumum
 * loadable weight false will be returned.
 *
 * @param {Number} lid load id
 * @param {Number} tid transporter id
 */
model.canLoad = function( lid, tid ){
  if( lid === tid ) util.raiseError("transporter cannot load itself");
  
  var transporter = model.units[ tid ];
  var load = model.units[ lid ];
    
  // LEFT SLOTS ?
  var maxLoads = transporter.type.maxloads;
  if( transporter.loadedIn + maxLoads + 1 === 0 ) return false; // LOADED IN OF TRNSP MARKS THE AMOUNT OF LOADS
                                                                // LOADS = (LOADIN + 1) + MAX_LOADS
  
  // IS UNIT TYPE LOADABLE ?
  var tpsL = transporter.type.canload;
  if(
    ( tpsL.indexOf( load.type.ID ) === -1 ) && // ID
    ( tpsL.indexOf( load.type.movetype ) === -1 ) && // MOVETYPE
    ( tpsL.indexOf("*") === -1 ) // ALL TYPE
  ) return false; 

  return true;
};

/**
 * Returns true if the unit with id tid is a traensporter, else false.
 *
 * @param {Number} tid transporter id
 */
model.isTransport = function( tid ){
  return typeof model.units[ tid ].type.maxloads === "number";
};