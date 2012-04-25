var _fillArray_ = function( n ){
  var r = [];
  for( var x=0; x<n; x++ ) r[x] = {};
  return r;
};

/** @type Array< { id } > */
var map = (function(){
  var r = [];
  // generates two dimension array
  for( var x=0; x<MAX_MAP_W; x++ ) r[x] = _fillArray_(MAX_MAP_H);
  return r;
})();

/** @type Array<{name,gold,units,team}> */
map.players = _fillArray_( MAX_PLAYER );
map.players[ map.players.length ] = { name:'NEUTRAL', team:999 };

/** @type Array<{capturePoints,owner}> */
map.properties = _fillArray_( 100 );

/** @type Array<{loads,leftWeight,maxWeight}> */
map.transports = _fillArray_( MAX_UNITS*MAX_PLAYER );

/** @type Array<{hp,ammo,fuel,exp,owner}> */
map.units = _fillArray_( MAX_UNITS*MAX_PLAYER );

// validators
map.playerIdValidator = { type:'integer', minimum:0, maximum:0, required:true };
map.unitIdValidator = { type:'integer', minimum:0, maximum:(MAX_PLAYER*MAX_UNITS)-1, required:true };
map.transportIdValidator = { type:'integer', minimum:0, maximum:0, required:true };
map.propertyIdValidator = { type:'integer', minimum:0, maximum:0, required:true };
map.xPositionValidator = { type:'integer', minimum:0, maximum:0, required:true };
map.yPositionValidator = { type:'integer', minimum:0, maximum:0, required:true };

map.areEnemies = function(p1,p2){
  return p1.team !== p2.team;
};


// ======================================================================
// ==================== RECYCLING FUNCTIONS =============================

map._receive = function( array, attr, eVal ){
  for( var i=0,e=array.length; i<e; i++ ){
    if( array[i][attr] === eVal ) return i;
  }
};

map.receiveProperty = function(){
  return map._receive( map.properties, 'owner', null );
};

map.receiveTransport = function( ){
  return map._receive( map.transports, 'maxWeight', -1 );
};

map.receivePlayer = function( ){
  return map._receive( map.players, 'team', -1 );
};

map.receiveUnit = function( ){
  return map._receive( map.units, 'owner', null );
};

map.recycleTransport = function( tr ){
  tr.maxWeight = -1;
};

map.recycleProperty = function( prop ){
  prop.owner = null;
};

map.recyclePlayer = function( player ){
  player.team = -1;
};

map.recycleUnit = function( unit ){
  unit.owner = null;
};

map.recycleAllTransports = function( ){
  for( var i=0,e=map.transports.length;i<e;i++) map.recycleTransport( map.transports[i] );
};

map.recycleAllProperties = function( ){
  for( var i=0,e=map.properties.length;i<e;i++) map.recycleProperty( map.properties[i] );
};

map.recycleAllPlayers = function( ){
  for( var i=0,e=map.players.length;i<e;i++) map.recyclePlayer( map.players[i] );
};

map.recycleAllUnits = function( ){
  for( var i=0,e=map.units.length;i<e;i++) map.recycleUnit( map.units[i] );
};

// ======================================================================
// ======================================================================