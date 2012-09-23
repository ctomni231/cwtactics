cwt._moveCardPool = null;

cwt.onInit( "move", function(){
  //cwt.transaction("moveUnit");
  cwt.transaction("_movePath");

  cwt._moveCardPool = cwt.util.objectPool(function( map ){

    map.uid = -1;
    map.x = -1;
    map.y = -1;
    map.r = -1;

    var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
    if( map.moveMap === undefined ){
      map.moveMap = cwt.util.matrix( moveMapDim, moveMapDim, -1 );
    }
    else{
      for( var x=0; x<moveMapDim; x++ ){
        for( var y=0; y<moveMapDim; y++ ){
          map.moveMap[x][y] = -1;
        }
      }
    }


    map.moveMapX = -1;
    map.moveMapY = -1;

    if( map.way === undefined ){
      map.way = [];
    }
    else{
      map.way.splice(0);
    }
  });
});

/** @config */
cwt.MAX_MOVE_RANGE = 15;

/** @constant */
cwt.MOVE_CODE_UP    = 0;

/** @constant */
cwt.MOVE_CODE_RIGHT = 1;

/** @constant */
cwt.MOVE_CODE_DOWN  = 2;

/** @constant */
cwt.MOVE_CODE_LEFT  = 3;

/**
 * Returns the costs for a movetype to move onto a tile type.
 *
 * @param movetype
 * @param tiletype
 */
cwt.moveCosts = function( movetype, tiletype ){
  var c;

  // search id
  var c = movetype.costs[ tiletype ];
  // console.log( "MOVECOST "+tiletype+" -> "+c );
  if( c !== undefined ) return c;

  // search tags (TODO)

  // fallback entry
  return movetype.costs["*"];
};

cwt.moveCostsForPos = function( card, x, y ){

  var sx = x - card.moveMapX;
  var sy = y - card.moveMapY;

  if( sx < 0 ||
      sy < 0 ||
      sx >= 2*cwt.MAX_MOVE_RANGE+1 ||
      sy >= 2*cwt.MAX_MOVE_RANGE+1    ){
    cwt.error("position {0},{1} is out of move map bounds",x,y);
  }
  else{
    return card.moveMap[sx][sy];
  }
}

/**
 * Creates a move map for a given unit. The position of the unit can be faked
 * by a given second and third argument that indicates a possible position.
 * If only the unit id is given, then the unit position will be used.
 */
cwt.createMoveCard = function( uid, x, y ){
  var unit = cwt.unitById( uid );
  var type = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( type.moveType );
  var player = cwt.player( unit.owner );

  // if no position is given then use the unit position
  if( arguments.length === 1 ){
    x = unit.x;
    y = unit.y;
  }

  var map = cwt._moveCardPool.request();

  // meta data
  map.uid = uid;
  map.x = x;
  map.y = y;
  map.r = type.moveRange;

  // var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
  // map.moveMap = cwt.util.matrix( moveMapDim, moveMapDim, -1 );
  map.moveMapX = Math.max( map.x - cwt.MAX_MOVE_RANGE, 0);
  map.moveMapY = Math.max( map.y - cwt.MAX_MOVE_RANGE, 0);

  // map.way = [];

  // decrease range if not enough fuel is available
  if( unit.fuel < map.r ) map.r = unit.fuel;

  // add start tile to map
  map.moveMap[ map.x-map.moveMapX ][ map.y-map.moveMapY ] = map.r;

  // build move map
  var tile, cost, rest;

  // TODO enhance
  var needsCheck = [ [ x, y, map.r ] ];
  while( needsCheck.length > 0 ){

    // get next tile
    // tile = needsCheck[ needsCheck.length-1 ];
    tile = needsCheck[ 0 ];
    needsCheck.splice(0,1);

    // UP
    if( tile[1] > 0 )
      cwt._moveCheck( tile[0], tile[1]-1, tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // RIGHT
    if( tile[0] < cwt.mapWidth-1 )
      cwt._moveCheck( tile[0]+1, tile[1], tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // DOWN
    if( tile[1] < cwt.mapHeight-1 )
      cwt._moveCheck( tile[0], tile[1]+1, tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );

    // LEFT
    if( tile[0] > 0 )
      cwt._moveCheck( tile[0]-1, tile[1], tile[2], mType, map.moveMap,
                      map.moveMapX, map.moveMapY,
                      needsCheck, player );
  }

  // convert left move points to cost points
  var moveMapDim = cwt.MAX_MOVE_RANGE*2+1;
  for( var x=0,xe=moveMapDim; x<xe; x++ ){
    for( var y=0,ye=moveMapDim; y<ye; y++ ){
      if( map.moveMap[x-map.moveMapX][y-map.moveMapY] != -1 ){
        map.moveMap[x-map.moveMapX][y-map.moveMapY] = cwt.moveCosts( mType, cwt._map[x][y] );
      }
    }
  }

  if( cwt.DEBUG ) cwt.info("result move card\n {0}", map );

  return map;
};

/**
 * Returns a path from (sx,sy) to (tx,ty) as array of move codes. If a move
 * with the current amount of fuel or movepoints is not possible, then an empty
 * array will be returned.
 *
 * @param uid
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 * @param mvp
 */
cwt.returnPath = function( uid, stx, sty, tx, ty , card){
  var moveMap = card.moveMap;
  var unit = cwt.unitById( card.uid );
  var type = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( type.moveType );
  //var nodes = [];

  /*
  var lx = +10000,
      ly = +10000,
      hx = -10000,
      hy = -10000;

  var keysY;
  var keysX = Object.keys( moveMap );
  for( var x=0,xe=keysX.length; x<xe; x++ ){

    if( parseInt( keysX[x], 10 ) < lx ) lx = parseInt( keysX[x], 10 );
    if( parseInt( keysX[x], 10 ) > hx ) hx = parseInt( keysX[x], 10 );

    keysY = Object.keys( moveMap[ keysX[x] ] );
    for( var y=0,ye=keysY.length; y<ye; y++ ){

      if( parseInt( keysY[y], 10 ) < ly ) ly = parseInt( keysY[y], 10 );
      if( parseInt( keysY[y], 10 ) > hy ) hy = parseInt( keysY[y], 10 );
    }
  }

  ly = parseInt( ly ,10 );
  lx = parseInt( lx ,10 );
  hx = parseInt( hx ,10 );
  hy = parseInt( hy ,10 );

  if( cwt.DEBUG ) cwt.info("lx:{0} hx:{1} ly:{2} hy:{3}",lx,hx,ly,hy);

  var sx = hx - lx + 1;
  var sy = hy - ly + 1;

  cwt.log.info("size x:{0} size y:{1}",sx,sy);

  for( var x = 0; x < sx; x++ ){
    nodes.push([]);
    for( var y = 0; y < sy; y++ ){

      var cost = moveMap[ lx+x ][ ly+y ];
      if( cost === undefined ) cost = 0; // wall / not movable
      nodes[ nodes.length-1 ][y] = cost;
    }
  }

  if( cwt.DEBUG ) cwt.info("nodes:{0}", nodes);

  var graph = new Graph( nodes );

  stx -= lx;
  sty -= ly;
  tx -= lx;
  ty -= ly;

  if( cwt.DEBUG ) cwt.info("sx:{0} sy:{1} tx:{2} ty:{3}",stx, sty,tx,ty);
  */

  // var graph = new Graph( nodes );
  var graph = new Graph( card.moveMap );
  var start = graph.nodes[stx-card.moveMapX][sty-card.moveMapY];
  var end = graph.nodes[tx-card.moveMapX][ty-card.moveMapY];
  var path = astar.search( graph.nodes, start, end );

  if( cwt.DEBUG ) cwt.info("path:{0}",path);

  var codesPath = [];
  var cx = stx-card.moveMapX;
  var cy = sty-card.moveMapY;
  var cNode;

  for( var i=0,e=path.length; i<e; i++ ){
    cNode = path[i];

    var dir;
    if( cNode.x > cx ) dir = 1;
    if( cNode.x < cx ) dir = 3;
    if( cNode.y > cy ) dir = 2;
    if( cNode.y < cy ) dir = 0;

    if( dir === undefined ) throw Error();

    codesPath.push( dir );

    cx = cNode.x;
    cy = cNode.y;
  }

  return codesPath;
};

/**
 * Makes a move by a given move card object.
 *
 * @param card
 */
cwt.moveUnit = function( card ){

  var cX = card.x,
      cY = card.y;
  var way = card.way;
  var unit = cwt.unitById( card.uid );
  var uType = cwt.unitSheet( unit.type );
  var mType = cwt.movetypeSheet( uType.moveType );

  // check move way end
  var lastIndex = way.length-1;
  var fuelUsed = 0;
  for( var i=0,e=way.length; i<e; i++ ){

    // get new current position
    switch( way[i] ){

      case cwt.MOVE_CODE_UP:
        if( cY === 0 ) cwt.error("cannot do move command UP because current position is at the border");
        cY--;
        break;

      case cwt.MOVE_CODE_RIGHT:
        if( cX === cwt.mapWidth-1 ){
          cwt.error("cannot do move command UP because current position is at the border");
        }
        cX++;
        break;

      case cwt.MOVE_CODE_DOWN:
        if( cY === cwt.mapHeight-1 ){
          cwt.error("cannot do move command DOWN because current position is at the border");
        }
        cY++;
        break;

      case cwt.MOVE_CODE_LEFT:
        if( cX === 0 ) cwt.error("cannot do move command LEFT because current position is at the border");
        cX--;
        break;

      default: throw Error("unknown command "+way[i]);
    }

    // is way blocked ?
    if( cwt._wayBlocked( cX, cY, unit.owner, i == e-1 ) ){

      lastIndex = i-1;

      if( lastIndex == -1 ){

        // that is a fault
        cwt.error("unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!");
      }

      break;
    }

    // increase fuel usage
    fuelUsed += cwt.moveCosts( mType, cwt._map[cX][cY] );
  }

  unit.fuel -= fuelUsed;

  cwt.setUnitPosition( card.uid ); // remove old reference
  cwt._movePath( card.uid, card.x, card.y , ( lastIndex !== way.length-1 )?
                                way.slice(0,lastIndex+1): way );

  cwt.setUnitPosition( card.uid, cX, cY ); // set new reference

  if( cwt.DEBUG ){
    cwt.info("moved unit {0} from ({1},{2}) to ({3},{4})",
      card.uid,
      card.x, card.y,
      cX, cY );
  }
};

cwt._movePath = function( uid, x,y, path ){}

/** @private */
cwt._moveCheck = function( tx, ty, mvp, mType, movemap, mX, mY, checkMap, player ){

  var cost = cwt.moveCosts( mType, cwt._map[ tx ][ ty ] );
  if( cost != 0 ){

    // TODO support move through allied and own units
    var unit = cwt.unitByPos( tx, ty );
    if( unit !== null && cwt.player(unit.owner).team !== player.team ){
      return; }

    var rest = mvp-cost;
    if( rest >= 0 ){

      if( movemap[ tx-mX ][ ty-mY ] < rest ){

        // add to to check map
        checkMap.push( [ tx, ty, rest ] );

        // add to move map
        movemap[ tx-mX ][ ty-mY ] = rest;

        // negative costs means same costs but not usable as target
        //if( unit !== null && cwt.model.player(unit.owner).team === player.team ){
        // movemap[ tx ][ ty ] = -rest; }
      }
    }
  }
};

/**
 * Is a way blocked if an unit of an owner want to move to a given position?
 *
 * @param x
 * @param y
 * @param owner
 * @private
 */
cwt._wayBlocked = function( x,y, owner, lastTile ){

  // check current position
  var unit = cwt.unitByPos(x,y);
  if( unit !== null ){

    if( unit.owner === owner ){

      if( lastTile ){

        // that is a fault
        cwt.error("cannot move onto a tile that is occupied by an own unit");
      }
      // else move through it :P
    }
    else if( cwt.player(unit.owner).team === cwt.player(owner).team ){

      if( lastTile ){

        // that is a fault
        cwt.error("cannot move onto a tile that is occupied by an allied unit");
      }
      // else move through it :P
    }
    else{

      // enemy unit
      return true;
    }
  }

  return false;
};