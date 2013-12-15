// Has a transporter unit with id tid loaded units? Returns true if yes,
// else false.
//
model.transport_hasLoads = function( tid ){
  assert( model.unit_isValidUnitId(tid) );

  var pid = model.unit_data[tid].owner;
  for( var i=model.unit_firstUnitId(pid),e=model.unit_lastUnitId(pid); i<e; i++ ){
    if( i !== tid ){
      var unit = model.unit_data[ i ];
      if( unit !== null && unit.loadedIn === tid ) return true;
    }
  }

  return false;
};

// Returns true if the unit with the id lid is loaded by a transporter unit
// with id tid.
//
model.transport_isLoadedBy = function( lid, tid ){
  assert( model.unit_isValidUnitId(lid) );
  assert( model.unit_isValidUnitId(tid) );
  assert( lid !== tid );

  return model.unit_data[ lid ].loadedIn === tid;
};

// Returns true if a tranporter with id tid can load the unit with the id lid.
// This function also calculates the resulting weight if the transporter would
// load the unit. If the calculated weight is greater than the maxiumum loadable
// weight false will be returned.
//
model.transport_canLoadUnit = function( lid, tid ){
  assert( model.unit_isValidUnitId( lid ) );
  assert( model.unit_isValidUnitId( tid ) );
  assert( tid !== lid );

  var transporter = model.unit_data[ tid ];
  var load        = model.unit_data[ lid ];

  assert( model.transport_isTransportUnit(tid) );
  assert( load.loadedIn !== tid );

  // `loadedIn` of transporter units marks the amount of loads
  // `LOADS = (LOADIN + 1) + MAX_LOADS`
  if( transporter.loadedIn + transporter.type.maxloads + 1 === 0 ) return false;

  return ( transporter.type.canload.indexOf( load.type.movetype ) !== -1 );
};

// Returns true if the unit with id tid is a traensporter, else false.
//
model.transport_isTransportUnit = function( tid ){
  assert( model.unit_isValidUnitId( tid ) );

  return typeof model.unit_data[ tid ].type.maxloads === "number";
};
