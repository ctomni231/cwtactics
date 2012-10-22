/**
 * @constant
 */
signal.EVENT_LOAD_MAP = "map:load";

/**
 * Two objects which have the same owner.
 *
 * @constant
 */
game.RELATIONSHIP_SAME_OWNER = 0;

/**
 * Two objects which have differnt of the same team.
 *
 * @constant
 */
game.RELATIONSHIP_ALLIED = 1;

/**
 * Two objects which have differnt owners of different teams.
 *
 * @constant
 */
game.RELATIONSHIP_ENEMY = 2;

/**
 * Two objects which have no relationship because one or both of them
 * hasn't an owner.
 *
 * @constant
 */
game.RELATIONSHIP_NONE = 3;

/**
 * @constant
 */
game.RELATIONSHIP_SAME_OBJECT = 4;

/**
 * Map width in tiles.
 */
domain.mapWidth = 0;

/**
 * Map height in tiles.
 */
domain.mapHeight = 0;

/**
 * Map table that holds all known tiles.
 */
domain.map = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Unit positions are stored here.
 */
domain.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Holds all unit objects of a game round.
 */
domain.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER,
  function(){
    return {
      x:0,
      y:0,
      type: null,
      loadedIn: -1,
      fuel: 0,
      owner: CWT_INACTIVE_ID
    }
  });

/**
 * Holds all player objects of a game round.
 */
domain.players = util.list( CWT_MAX_PLAYER+1,
  function( index ){
    var neutral = (index === CWT_MAX_PLAYER );
    return {
      gold: 0,
      team: ( neutral )? 9999 : CWT_INACTIVE_ID,
      name: ( neutral )? "NEUTRAL" : null
    }
  });

/**
 * Returns the current active map height.
 */
game.mapHeight = function(){
  return domain.mapHeight;
};

/**
 * Returns the current active map width.
 */
game.mapWidth = function(){
  return domain.mapWidth;
};

/**
 * Returns the tile type by a position.
 *
 * @param x
 * @param y
 */
game.tileByPos = function( x,y ){
  return domain.map[x][y];
};

/**
 * Returns an unit by its id.
 *
 * @param id
 */
game.unitById = function(id){
  if( id < 0 || domain.units.length < id ){
    util.logError("invalid unit id",id);
  }

  var o = domain.units[id];
  return ( o.owner === CWT_INACTIVE_ID )? null : o;
};

/**
 * Returns an unit by its position.
 *
 * @param id
 */
game.unitByPos = function( x, y ){
  return domain.unitPosMap[x][y];
};

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
game.extractUnitId = function( unit ){
  if( unit === null ){
    util.logError("unit argument cannot be null");
  }

  var units = domain.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  // illegal unit object ?!
  util.logError("cannot find unit",util.objectToJSON(unit));
};

/**
 * Returns a player by its id.
 *
 * @param id
 */
game.player = function(id){
  if( id < 0 || domain.players.length <= id ){
    util.logError("invalid id");
  }

  var o = domain.players[id];
  if( o.team === CWT_INACTIVE_ID ) return null;

  return o;
};

/**
 * Returns the neutral player id.
 */
game.neutralPlayerId = function(){
  return domain.players.length-1;
};

/**
 * Returns true if a given position is occupied by an unit.
 *
 * @param x
 * @param y
 */
game.tileOccupiedByUnit = function( x,y ){
  var unit = game.unitByPos(x,y);
  if( unit === null ) return false;
  else{
    return game.extractUnitId( unit );
  }
};

/**
 * Returns the distance of two positions.
 *
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 */
game.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 * Returns the relationship between two player identicals.
 *
 * @param pidA player id or ownable object
 * @param pidB player id or ownable object
 */
game.relationshipBetween = function( pidA, pidB ){
  if( pidA === null || pidB === null ){
    return game.RELATIONSHIP_NONE;
  }

  if( typeof pidA !== 'number' &&  typeof pidB !== 'number'
    && pidA === pidB ) return game.RELATIONSHIP_SAME_OBJECT;

  if( typeof pidA !== 'number' ) pidA = pidA.owner;
  if( typeof pidB !== 'number' ) pidB = pidB.owner;

  if( pidA === pidB ) return game.RELATIONSHIP_SAME_OWNER;
  else {
    var tidA = game.player( pidA );
    var tidB = game.player( pidB );
    if( tidA === tidB ){
      return game.RELATIONSHIP_ALLIED;
    }
    else return game.RELATIONSHIP_ENEMY;
  }
};

/**
 * Erases an unit position.
 *
 * @param uid
 */
game.eraseUnitPosition = function( uid ){
  game.setUnitPosition( uid );
};

/**
 * Sets the position of an unit.
 *
 * @param uid
 * @param tx
 * @param ty
 */
game.setUnitPosition = function( uid, tx, ty ){
  var unit = game.unitById(uid);
  var ox = unit.x;
  var oy = unit.y;
  var uPosMap = domain.unitPosMap;

  // clear old position
  uPosMap[ox][oy] = null;

  // unit has a new position
  if( arguments.length > 1 ){
    unit.x = tx;
    unit.y = ty;

    uPosMap[tx][ty] = unit;
  }
};

/**
 * Returns true, if the given object seems to be an unit, else false.
 *
 * @param o
 */
game.isUnit = function( o ){
  return o.hasOwnProperty("hp");
};

/**
 * Returns true if the given object seems to be a property, else false.
 *
 * @param o
 */
game.isProperty = function( o ){
  return o.hasOwnProperty("capturePoints");
};

/**
 * One unit joins another unit and combines its health points with the other
 * unit to heal damages. The joining unit will be removed.
 */
actions.join = {

  condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
    if( selected === null ) return;
    if( rStU !== game.RELATIONSHIP_SAME_OWNER ) return;

    return ( selected.type === unit.type && unit.hp < 99 );
  },

  action: function( x, y, suid, tprid, tuid ){
    var unit = game.unitById(suid);
    var junit = game.unitById(tuid);
    game.eraseUnitPosition( suid );
    unit.owner = -1;

    junit.hp += unit.hp;
    if( junit.hp > 99 ) junit.hp = 99;

    signal.emit( signal.EVENT_INTO_WAIT, tuid );
  }
};


/**
 * Loads a map and initializes the game context.
 *
 * @event map.load
 */
signal.connect( game.EVENT_LOAD_MAP, function( channel, mapData ){
  if( util.DEBUG ){
    util.logInfo("start loading map");
  }

  // TODO map is data from outside, check it via shema

  // meta data
  domain.mapWidth = mapData.width;
  domain.mapHeight = mapData.height;

  // TODO this should be in map data possible
  // TODO too ( e.g. if map is the result of a save game )
  // this._day = 0;
  // this._activePlayer = 0;
  domain.turnOwner = 0;

  // filler
  for( var x=0, e1= domain.mapWidth; x<e1; x++ ){
    for( var y=0, e2= domain.mapHeight; y<e2; y++ ){
      domain.map[x][y] = mapData.filler;
    }
  }

  for( var x=0, e1= mapData.mapWidth; x<e1; x++ ){
    for( var y=0, e2= mapData.maxHeight; y<e2; y++ ){
      domain.unitPosMap[x][y] = null;
    }
  }

  // special tiles
  var cols = Object.keys( mapData.data );
  for( var i=0,e=cols.length; i<e; i++ ){

    var x = parseInt(cols[i],10);
    var rows = Object.keys( mapData.data[ cols[i] ] );
    for( var j=0,f=rows.length; j<f; j++ ){

      var y = parseInt(rows[j],10);
      domain.map[x][y] = mapData.data[ cols[i] ][ rows[j] ];
    }
  }

  for( var i=0, e= domain.units.length; i<e; i++){
    domain.units[i].owner = CWT_INACTIVE_ID;
  }

  // players
  for( var i = 0, e = mapData.players.length; i<e; i++){
    var s_player = mapData.players[i];
    var t_player = domain.players[i];

    t_player.gold = s_player.gold;
    t_player.team = s_player.team;
    t_player.name = s_player.name;

    // units
    var startIndex = i*CWT_MAX_UNITS_PER_PLAYER;
    for( var j = 0, ej = s_player.units.length; j<ej; j++){
      var s_unit = s_player.units[j];
      var t_unit = domain.units[ startIndex+j ];

      t_unit.fuel  = s_unit.fuel;
      t_unit.x     = s_unit.x;
      t_unit.y     = s_unit.y;
      t_unit.hp    = s_unit.hp;
      t_unit.ammo  = s_unit.ammo;
      t_unit.type  = s_unit.type;
      t_unit.owner = s_unit.owner;
      t_unit.loadedIn = -1;

      // TODO use identical
      domain.unitPosMap[s_unit.x][s_unit.y] = t_unit;
    }
  }
  for( var i=mapData.players.length,e= domain.players.length; i<e; i++){
    if( i !== game.neutralPlayerId() ){
      domain.players[i].team = CWT_INACTIVE_ID;
    }
  }

  // properties
  for( var i = 0, e = mapData.properties.length; i<e; i++){
    var s_property = mapData.properties[i];
    var t_property = domain.properties[i];

    t_property.owner          = s_property.owner;
    if( t_property.owner === undefined ) t_property.owner = game.neutralPlayerId();

    t_property.capturePoints  = s_property.capturePoints;
    t_property.type           = s_property.type;
    t_property.x              = s_property.x;
    t_property.y              = s_property.y;

    // TODO use identical
    domain.propertyPosMap[t_property.x][t_property.y] = t_property;
  }
  for( var i=mapData.properties.length,e=domain.properties.length; i<e; i++){
    domain.properties[i].owner = CWT_INACTIVE_ID;
  }

  // add actors
  var startIndex= domain.turnOwner*CWT_MAX_UNITS_PER_PLAYER;
  for( var i= startIndex,
           e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    domain.leftActors[i-startIndex] = (game.unitById(i) !== null)? true : false;
  }

  if( util.DEBUG ){
    util.logInfo("map successfully loaded");
  }
});
