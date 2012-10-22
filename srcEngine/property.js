/**
 *
 */
domain.properties = util.list( CWT_MAX_PROPERTIES+1,
  function(){
    return {
      capturePoints: 20,
      owner: -1
    }
  });

/**
 *
 */
domain.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Returns a property by its id.
 *
 * @param id
 */
game.propertyById = function(id){
  if( id < 0 || domain.properties.length <= id ){
    util.logError("invalid property id",id);
  }

  var o = domain.properties[id];
  return ( o.owner === CWT_INACTIVE_ID )? null : o;
};

/**
 * Returns a property by its position.
 *
 * @param id
 */
game.propertyByPos = function( x, y ){
  return domain.propertyPosMap[x][y];
};

/**
 *
 * @param x
 * @param y
 */
game.tileIsProperty = function( x,y ){
  var prop = game.propertyByPos(x,y);
  if( prop === null ) return false;
  else{
    return game.extractPropertyId( prop );
  }
};

/**
 * Extracts the identical number from a property object.
 *
 * @param unit
 */
game.extractPropertyId = function( property ){
  if( property === null ){
    util.logError("property argument cannot be null");
  }

  var props = domain.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }

  // illegal unit object ?!
  util.logError("cannot find property",property );
};

/**
 * Captures a property by a given unit.
 *
 * @param x x position
 * @param y y position
 * @param id identical number for the capturing unit object
 */
game.captureProperty = function( x, y, id ){
  var unit   = game.unitById(id);
  var unitSh = game.unitSheet( unit.type );
  var prop   = game.propertyByPos( x, y );
  prop.capturePoints -= unitSh.captures;
  if( prop.capturePoints <= 0 ){
    if( util.DEBUG ){
      util.logInfo( "property at (",x,",",y,") captured");
    }

    if( prop.type === 'HQ' ){
      signal.emit( signal.EVENT_HQ_LOST,
        prop.owner, game.extractPropertyId(prop) );
    }

    // set new meta data for property
    prop.capturePoints = 20;
    prop.owner = unit.owner;
  }
};

/** @constant */
signal.EVENT_HQ_LOST = "capture:hqLost";

signal.connect( signal.EVENT_HQ_LOST, function( ch, pid, hqid ){
  var oldPlayer = game.player( pid );

  for( var i = pid * CWT_MAX_UNITS_PER_PLAYER,
           e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    domain.units[i].team = -1;
    domain.unitPosMap[ domain.units[i].x ][ domain.units[i].y ] = null;
  }

  for( var i = 0, e = domain.properties.length; i<e; i++ ){
    if( domain.properties[i].owner === pid ){
        domain.properties[i].owner = -1;
    }
  }

  oldPlayer.team = -1;

  // check win/loose
  if( game.annithilationWinner() ){
    if( util.DEBUG ){
      util.logInfo("the game ends because no opposite players exists");
    }
  }
});

/**
 * Captures a property by an unit that can capture properties. The old owner
 * of the property will loose the game round if was a headquarters.
 */
actions.captureProperty = {

  condition: function( x, y, rStP, rStU , selected, property, unit ){
    return (
      rStP === game.RELATIONSHIP_ENEMY &&
        ( rStU === game.RELATIONSHIP_NONE || game.RELATIONSHIP_SAME_OBJECT ) &&

        game.tileSheet( property.type ).capturePoints > 0 &&
        game.unitSheet( selected.type ).captures > 0
      );
  },

  action: function( x, y, suid ){
    game.captureProperty( x,y,suid );
    signal.emit( signal.EVENT_INTO_WAIT, suid );
  }
};

actions.silofire = {

  targetSelection: true,
  freeTarget: true,

  _doDamage: function( x,y, dmg ){
    var unit = game.unitByPos(x,y);
    if( unit !== null ){
      unit.hp -= dmg;
      if( unit.hp < 9 ) unit.hp = 9;
    }
  },

  condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
    // if( property.owner !== game.getTurnOwner() ) return;
    if( selected === null ) return false;
    if( selected.type !== "INFT_OS" && selected.type !== "MECH_OS" ){
      return false;
    }

    return ( property.type === "SILO" );
  },

  action: function( x, y, suid, tprid, tuid, ax, ay ){
    var mapW = game.mapWidth();
    var mapH = game.mapHeight();
    var dmgF = actions.silofire._doDamage;
    var dmg  = 20;

    // LEFT
    if( ax-1 >= 0 ){

      // OUTER LEFT COLUMN
      if( ax-2 >= 0 )    dmgF( ax-2, ay, dmg );

      // LEFT COLUMN
      if( ay-1 >= 0 )    dmgF( ax-1, ay-1, dmg );
      dmgF( ax-1, ay,   dmg );
      if( ay+1 < mapH )  dmgF( ax-1, ay+1, dmg );
    }

    // X COLUMN
    if( ay-1 >= 0 ){     dmgF( ax, ay-1, dmg );
      if( ay-2 >= 0 ){   dmgF( ax, ay-2, dmg ); }}
    dmgF( ax, ay,   dmg );
    if( ay+1 < mapH ){   dmgF( ax, ay+1, dmg );
      if( ay+2 < mapH ){ dmgF( ax, ay+2, dmg ); }}

    // RIGHT
    if( ax+1 < mapW ){

      // RIGHT COLUMN
      if( ay-1 >= 0 )    dmgF( ax+1, ay-1, dmg );
      dmgF( ax+1, ay,   dmg );
      if( ay+1 < mapH )  dmgF( ax+1, ay+1, dmg );

      // OUTER RIGHT COLUMN
      if( ax+2 < mapW )  dmgF( ax+2, ay, dmg );
    }

    // SET EMPTY TYPE
    game.propertyById( tprid ).type = "SILO_EMPTY";
    signal.emit( signal.EVENT_INTO_WAIT, suid );
  }
};