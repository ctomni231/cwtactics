controller.registerInvokableCommand("loadUnitInto");
controller.registerInvokableCommand("unloadUnitFrom");

controller.defineEvent("loadUnitInto");
controller.defineEvent("unloadUnitFrom");

// Defines some type sheet requirements for transport logics
model.unitTypeParser.addHandler(function(sheet){
    var list,i1,e1;
    
    if( !util.expectBoolean(sheet,"suppliesloads",false) ) return false;
    
    if( util.expectArray(sheet,"canload",false) === util.expectMode.DEFINED ){
      if( !util.expectNumber(sheet,"maxloads",true,true,1,5) ) return false;
      
      list = sheet.canload;
      for( i1=0,e1=list.length; i1<e1; i1++ ){
        if( !expectString(list,i1,true) ) return false;  
      } 
    }
});

// Has a transporter unit with id tid loaded units? Returns true if yes, else
// false.
//
// @param {Number} tid transporter id
//
model.hasLoadedIds = function( tid ){
  var pid = model.units[tid].owner;
  for( var i=model.getFirstUnitSlotId(pid), e=model.getLastUnitSlotId(pid); i<e; i++ ){
    if( i !== tid ){
      
      var unit = model.units[ i ];
      if( unit !== null && unit.loadedIn === tid ) return true;
    }
  }

  return false;
};

// Returns true if the unit with the id lid is loaded by a transporter unit
// with id tid.
//
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.isLoadedBy = function( lid, tid ){
  return model.units[ lid ].loadedIn === tid;
};

// Loads the unit with id lid into a tranporter with the id tid.
//
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.loadUnitInto = function( loadId, transportId ){
  if( !model.canLoad( loadId, transportId ) ){
    util.raiseError("transporter unit",transportId,"cannot load unit",loadId);
  }

  model.units[ loadId ].loadedIn = transportId;
  model.units[ transportId ].loadedIn--;
  
  // Invoke event
  var evCb = controller.events.loadUnitInto;
  if( evCb ) evCb( loadId, transportId );
};

// Unloads the unit with id lid from a tranporter with the id tid.
//
// @param {Number} lid
// @param {Number} tid
// 
model.unloadUnitFrom = function( transportId, trsx, trsy, loadId, tx,ty ){
  
  // error check: is really loaded by `transportId` ?
  if( model.units[ loadId ].loadedIn !== transportId ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.LOAD_IS_NOT_IN_TRANSPORTER 
  );
  
  // TODO: remove this later
  // trapped ?
  if( tx === -1 || ty === -1 ) return;

  // remove transport link
  model.units[ loadId ].loadedIn = -1;
  model.units[ transportId ].loadedIn++;

  // extract mode code id
  var moveCode;
  if( tx < trsx )      moveCode = model.moveCodes.LEFT;
  else if( tx > trsx ) moveCode = model.moveCodes.RIGHT;
  else if( ty < trsy ) moveCode = model.moveCodes.UP;
  else if( ty > trsy ) moveCode = model.moveCodes.DOWN;

  // Invoke event
  var evCb = controller.events.unloadUnitFrom;
  if( evCb ) evCb( transportId, trsx, trsy, loadId, tx,ty );
  
  // move load out of the transporter
  model.moveUnit([moveCode], loadId, trsx, trsy);
  model.markUnitNonActable( loadId );
};

// Returns true if a tranporter with id tid can load the unit with the id
// lid. This function also calculates the resulting weight if the transporter
// would load the unit. If the calculated weight is greater than the maxiumum
// loadable weight false will be returned.
// 
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.canLoad = function( lid, tid ){
  
  // error check: transporters cannot load itself
  if( lid === tid ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.TRANSPORTER_CANNOT_LOAD_ITSELF 
  );
  
  var transporter = model.units[ tid ];
  
  // error check: non-transporters cannot load anything
  if( util.notIn( "maxloads", transporter.type ) ) model.criticalError( 
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.TRANSPORTER_EXPECTED 
  );
  
  var load = model.units[ lid ];
    
  // `loadedIn` of transporter units marks the amount of loads
  // ```LOADS = (LOADIN + 1) + MAX_LOADS```
  if( transporter.loadedIn + transporter.type.maxloads + 1 === 0 ) return false; 
  
  // is unit technically load able ?
  return ( transporter.type.canload.indexOf( load.type.class ) !== -1 );
};

// Returns true if the unit with id tid is a traensporter, else false.
//
// @param {Number} tid transporter id
// 
model.isTransport = function( tid ){
  
  // if `maxloads` is defined then it is a transport
  return util.isIn( "maxloads", model.units[ tid ].type );
};