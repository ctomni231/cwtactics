/** @config */
cwt.MAX_MAP_WIDTH = 100;

/** @config */
cwt.MAX_MAP_HEIGHT = 100;

/** @config */
cwt.MAX_PLAYER = 8;

/** @config */
cwt.MAX_UNITS_PER_PLAYER = 50;

/** @config */
cwt.MAX_PROPERTIES = 200;

/** @constant */
cwt.INACTIVE_ID = -1;

/** @private */
cwt.mapWidth = 0;

/** @private */
cwt.mapHeight = 0;

/** @private */
cwt._map = null;

/** @private */
cwt._unitPosMap = null;

/** @private */
cwt._units = null;

/** @private */
cwt._players = null;

/** @private */
cwt._propertyPosMap = null;

/** @private */
cwt._properties = null;

cwt.onInit( "model", function( annotated ){

  cwt.serializedProperty("mapWidth");
  cwt.serializedProperty("mapHeight");
  cwt.serializedProperty("_map");
  cwt.serializedProperty("_units");
  cwt.serializedProperty("_players");
  cwt.serializedProperty("_properties");
  cwt.serializedProperty("_unitPosMap");
  cwt.serializedProperty("_propertyPosMap");

  cwt.transaction("setUnitPosition");

  var maxW = cwt.MAX_MAP_WIDTH;
  var maxH = cwt.MAX_MAP_HEIGHT;

  cwt._map = cwt.util.matrix( maxW, maxH, null );
  cwt._unitPosMap = cwt.util.matrix( maxW, maxH, null );
  cwt._propertyPosMap = cwt.util.matrix( maxW, maxH, null );

  cwt._units = cwt.util.list( cwt.MAX_PLAYER*cwt.MAX_UNITS_PER_PLAYER,
  function(){
    return {
      x:0,
      y:0,
      type: null,
      fuel: 0,
      owner: cwt.INACTIVE_ID
    }
  });

  cwt._players = cwt.util.list( cwt.MAX_PLAYER+1,
  function( index ){
    var neutral = (index === 8);
    return {
      gold: 0,
      team: ( neutral )? 9999 : cwt.INACTIVE_ID,
      name: ( neutral )? "NEUTRAL" : null
    }
  });

  cwt._properties = cwt.util.list( cwt.MAX_PROPERTIES,
  function(){
    return {
      capturePoints: 20,
      owner: -1
    }
  });
});

/**
 * Returns an unit by its id.
 *
 * @param id
 */
cwt.unitById = function(id){
  if( id < 0 || cwt._units.length <= id ){
    cwt.error("invalid unit id {0}",id);
  }

  var o = this._units[id];
  return ( o.owner === cwt.INACTIVE_ID )? null : o;
};

/**
 * Returns an unit by its position.
 *
 * @param id
 */
cwt.unitByPos = function( x, y ){
  return cwt._unitPosMap[x][y];
};

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
cwt.extractUnitId = function( unit ){
  if( unit === null ){
    cwt.error("unit argument cannot be null");
  }

  var units = cwt._units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  // illegal unit object ?!
  cwt.error("cannot find unit {0}",unit);
};

/**
 * Returns a player by its id.
 *
 * @param id
 */
cwt.player = function(id){
  if( id < 0 || this._players.length <= id ) cwt.log.error("invalid id");

  var o = this._players[id];
  if( o.team === cwt.INACTIVE_ID ) return null; //throw Error("invalid id");

  return o;
};

/**
 * Returns a property by its id.
 *
 * @param id
 */
cwt.propertyById = function(id){
  if( id < 0 || cwt._properties.length <= id ){
    cwt.error("invalid property id {0}",id);
  }

  var o = cwt._properties[id];
  return ( o.owner === cwt.INACTIVE_ID )? null : o;
};

/**
 * Returns a property by its position.
 *
 * @param id
 */
cwt.propertyByPos = function( x, y ){
  return cwt._propertyPosMap[x][y];
};

cwt.tileOccupiedByUnit = function( x,y ){
  var unit = cwt.unitByPos(x,y);
  if( unit === null ) return false;
  else{
    return cwt.extractUnitId( unit );
  }
};

cwt.tileIsProperty = function( x,y ){
  var prop = cwt.propertyByPos(x,y);
  if( prop === null ) return false;
  else{
    return cwt.extractPropertyId( prop );
  }
};

/**
 * Extracts the identical number from a property object.
 *
 * @param unit
 */
cwt.extractPropertyId = function( property ){
  if( property === null ){
    cwt.error("property argument cannot be null");
  }

  var props = cwt._properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  // illegal unit object ?!
  cwt.error("cannot find property {0}", property );
};

cwt.setUnitPosition = function( uid, tx, ty ){
  var unit = cwt.unitById(uid);
  var ox = unit.x;
  var oy = unit.y;
  var uPosMap = cwt._unitPosMap;

  // clear old position
  uPosMap[ox][oy] = null;

  // unit has a new position
  if( arguments.length > 1 ){
    unit.x = tx;
    unit.y = ty;

    uPosMap[tx][ty] = unit;
  }
}

/**
 * Loads a map and initializes the game context.
 */
cwt.loadMap = function( data ){

  if( cwt.DEBUG ){
    cwt.info("start loading map");
  }

  // TODO map is data from outside, check it via shema

  // meta data
  cwt.mapWidth = data.width;
  cwt.mapHeight = data.height;

  // TODO this should be in map data possible
  // TODO too ( e.g. if map is the result of a save game )
  // this._day = 0;
  // this._activePlayer = 0;
  cwt._turnPid = 0;

  // filler
  for( var x=0, e1=cwt.mapWidth; x<e1; x++ ){
    for( var y=0, e2=cwt.mapHeight; y<e2; y++ ){
      cwt._map[x][y] = data.filler;
    }
  }

  for( var x=0, e1=cwt.mapWidth; x<e1; x++ ){
    for( var y=0, e2=cwt.maxHeight; y<e2; y++ ){
      cwt._unitPosMap[x][y] = null;
    }
  }

  // special tiles
  cwt.util.each( data.data , function( col, x ){
    cwt.util.each( col , function( tile, y ){
      cwt._map[x][y] = tile;
    });
  });


  for( var i=0, e=cwt._units.length; i<e; i++){
    cwt._units[i].owner = cwt.INACTIVE_ID;
  }

  // players
  for( var i = 0, e = data.players.length; i<e; i++){
    var s_player = data.players[i];
    var t_player = cwt._players[i];

    t_player.gold = s_player.gold;
    t_player.team = s_player.team;
    t_player.name = s_player.name;

    // units
    var startIndex = i*cwt.MAX_UNITS_PER_PLAYER;
    for( var j = 0, ej = s_player.units.length; j<ej; j++){
      var s_unit = s_player.units[j];
      var t_unit = this._units[ startIndex+j ];

      t_unit.fuel  = s_unit.fuel;
      t_unit.x     = s_unit.x;
      t_unit.y     = s_unit.y;
      t_unit.type  = s_unit.type;
      t_unit.owner = s_unit.owner;

      // TODO use identical
      cwt._unitPosMap[s_unit.x][s_unit.y] = t_unit;
    }
  }
  for( var i=data.players.length,e=cwt._players.length; i<e; i++){
    cwt._players[i].team = cwt.INACTIVE_ID;
  }

  // properties
  for( var i = 0, e = data.properties.length; i<e; i++){
    var s_property = data.properties[i];
    var t_property = cwt._properties[i];

    t_property.owner          = s_property.owner;
    t_property.capturePoints  = s_property.capturePoints;
    t_property.type           = s_property.type;
    t_property.x              = s_property.x;
    t_property.y              = s_property.y;

    // TODO use identical
    cwt._propertyPosMap[t_property.x][t_property.y] = t_property;
  }
  for( var i=data.properties.length,e=cwt._properties.length; i<e; i++){
    cwt._properties[i].owner = cwt.INACTIVE_ID;
  }

  if( cwt.DEBUG ){
    cwt.info("map successfully loaded");
  }
};