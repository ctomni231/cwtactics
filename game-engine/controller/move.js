/**
 * Move controller that holds all actions and helpers for moving units through the map.
 *
 * @namespace
 */
cwt.move = {

  /**
   * Diferent move codes to describe move ways.
   *
   * @namespace
   */
  MOVE_CODES:{

    /** @constant */ UP: 0,
    /** @constant */ RIGHT: 1,
    /** @constant */ DOWN: 2,
    /** @constant */ LEFT: 3
  },

  /**
   * Used as card object to hold all values of a move.
   *
   * @private
   */
  _currentCard: {
    //TODO use this card rather than recreating new ones
    uid: 0,

    x: 0,
    y: 0,
    r: 0,

    moveMap: {},
    way: []
  },

  /**
   * Returns the costs for a movetype to move onto a tile type.
   *
   * @param movetype
   * @param tiletype
   */
  moveCosts: function( movetype, tiletype ){
    var c;

    // search id
    var c = movetype.costs[ tiletype ];
    // console.log( "MOVECOST "+tiletype+" -> "+c );
    if( c !== undefined ) return c;

    // search tags (TODO)

    // fallback entry
    return movetype.costs["*"];
  },

  /**
   * Creates a move map for a given unit. The position of the unit can be faked by a given second
   * and third argument that indicates a possible position. If only the unit id is given, then
   * the unit position will be used.
   */
  createMoveCard: function( uid, x, y ){
    var map = {};
    var unit = cwt.model.unit( uid );
    var type = cwt.db.unit( unit.type );
    var mType = cwt.db.movetype( type.moveType );
    var player = cwt.model.player( unit.owner );

    // if no position is given then use the unit position
    if( arguments.length === 1 ){
      x = unit.x;
      y = unit.y;
    }

    // meta data
    map.uid = uid;
    map.x = x;
    map.y = y;
    map.r = type.moveRange;
    map.moveMap = {};
    map.way = [];

    // decrease range if not enough fuel is available
    if( unit.fuel < map.r ) map.r = unit.fuel;

    // build move map
    var tile,
      cost,

      rest;
    var needsCheck = [ [ x, y, map.r ] ];
    while( needsCheck.length > 0 ){

      // get next tile
      // tile = needsCheck[ needsCheck.length-1 ];
      tile = needsCheck[ 0 ];
      needsCheck.splice(0,1);

      // UP
      if( tile[1] > 0 )
        this._checkMove( tile[0], tile[1]-1, tile[2], mType, map.moveMap, needsCheck, player );

      // RIGHT
      if( tile[0] < cwt.model._width-1 )
        this._checkMove( tile[0]+1, tile[1], tile[2], mType, map.moveMap, needsCheck, player );

      // DOWN
      if( tile[1] < cwt.model._height-1 )
        this._checkMove( tile[0], tile[1]+1, tile[2], mType, map.moveMap, needsCheck, player );

      // LEFT
      if( tile[0] > 0 )
        this._checkMove( tile[0]-1, tile[1], tile[2], mType, map.moveMap, needsCheck, player );
    }

    var keysY;
    var keysX = Object.keys( map.moveMap );
    for( var x=0,xe=keysX.length; x<xe; x++ ){

      keysY = Object.keys( map.moveMap[ keysX[x] ] );
      for( var y=0,ye=keysY.length; y<ye; y++ ){

        map.moveMap[ keysX[x] ][ keysY[y] ] = this.moveCosts( mType,
          cwt.model._map[ parseInt(keysX[x],10) ][ parseInt(keysY[y],10) ] );
      }
    }

    if( cwt.DEBUG ) cwt.log.info("result move card- "+JSON.stringify( map ));

    return map;
  },

  _checkMove: function( tx, ty, mvp, mType, movemap, checkMap, player ){

    var cost = this.moveCosts( mType, cwt.model._map[ tx ][ ty ] );
    if( cost != 0 ){

      // TODO support move through allied and own units
      var unit = cwt.model.unitByPos( tx, ty );
      if( unit !== null && cwt.model.player(unit.owner).team !== player.team ){
        return; }

      var rest = mvp-cost;
      if( rest >= 0 ){

        if( movemap[ tx ] === undefined ){
            movemap[ tx ] = {};
        }

        if( movemap[ tx ][ ty ] === undefined ||
            movemap[ tx ][ ty ] < rest ){

          // add to to check map
          checkMap.push( [ tx, ty, rest ] );

          // add to move map
          movemap[ tx ][ ty ] = rest;

          // negative costs means same costs but not usable as target
          //if( unit !== null && cwt.model.player(unit.owner).team === player.team ){
           // movemap[ tx ][ ty ] = -rest; }
        }
      }
    }
  },

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
  returnPath: function( uid, stx, sty, tx, ty , card){
    var moveMap = card.moveMap;
    var unit = cwt.model.unit( card.uid );
    var type = cwt.db.unit( unit.type );
    var mType = cwt.db.movetype( type.moveType );
    var nodes = [];

    var lx = +10000,
        ly = +10000,
        hx = -10000,
        hy = -10000;

    var keysY;
    var keysX = Object.keys( moveMap );
    for( var x=0,xe=keysX.length; x<xe; x++ ){

      if( keysX[x] < lx ) lx = keysX[x];
      if( keysX[x] > hx ) hx = keysX[x];

      keysY = Object.keys( moveMap[ keysX[x] ] );
      for( var y=0,ye=keysY.length; y<ye; y++ ){

        if( keysY[y] < ly ) ly = keysY[y];
        if( keysY[y] > hy ) hy = keysY[y];
      }
    }

    ly = parseInt( ly ,10 );
    lx = parseInt( lx ,10 );
    hx = parseInt( hx ,10 );
    hy = parseInt( hy ,10 );

    cwt.log.info("lx:{0} hx:{1} ly:{2} hy:{3}",lx,hx,ly,hy);

    var sx = hx - lx + 1;
    var sy = hy - ly + 1;

    cwt.log.info("sx:{0} sy:{1}",sx,sy);

    for( var x = 0; x < sx; x++ ){
      nodes.push([]);
      for( var y = 0; y < sy; y++ ){

        var cost = moveMap[ lx+x ][ ly+y ];
        if( cost === undefined ) cost = 0; // wall / not movable
        nodes[ nodes.length-1 ][y] = cost;
      }
    }

    cwt.log.info("nodes:{0}", nodes);

    var graph = new Graph( nodes );

    stx -= lx;
    sty -= ly;
    tx -= lx;
    ty -= ly;
    cwt.log.info("sx:{0} sy:{1} tx:{2} ty:{3}",stx, sty,tx,ty);

    var start = graph.nodes[stx][sty];
    var end = graph.nodes[tx][ty];

    var path = astar.search( graph.nodes, start, end );

    cwt.log.info("path:{0}",path);

    var codesPath = [];
    var cx = stx;
    var cy = sty;
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
  },

  /**
   * Makes a move by a given move card object.
   *
   * @param card
   */
  move: function( card ){

    var cX = card.x,
      cY = card.y;
    var way = card.way;
    var unit = cwt.model.unit( card.uid );
    var uType = cwt.db.unit( unit.type );
    var mType = cwt.db.movetype( uType.moveType );

    // check move way end
    var lastIndex = way.length-1;
    var fuelUsed = 0;
    for( var i=0,e=way.length; i<e; i++ ){

      // get new current position
      switch( way[i] ){

        case this.MOVE_CODES.CODE_UP:
          if( cY === 0 ) cwt.log.error("cannot do move command UP because current position is at the border");
          cY--;
          break;

        case this.MOVE_CODES.CODE_RIGHT:
          if( cX === cwt.model._width-1 ){
            cwt.log.error("cannot do move command UP because current position is at the border");
          }
          cX++;
          break;

        case this.MOVE_CODES.CODE_DOWN:
          if( cY === cwt.model._height-1 ){
            cwt.log.error("cannot do move command DOWN because current position is at the border");
          }
          cY++;
          break;

        case this.MOVE_CODES.CODE_LEFT:
          if( cX === 0 ) cwt.log.error("cannot do move command LEFT because current position is at the border");
          cX--;
          break;

        default: throw Error("unknown command "+way[i]);
      }

      // is way blocked ?
      if( this._wayBlocked( cX, cY, unit.owner, i == e-1 ) ){

        lastIndex = i-1;

        if( lastIndex == -1 ){

          // that is a fault
          cwt.log.error("unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!");
        }

        break;
      }

      // increase fuel usage
      fuelUsed += this.moveCosts( mType, cwt.model._map[cX][cY] );
    }

    // update meta data
    unit.x = cX;
    unit.y = cY;
    unit.fuel -= fuelUsed;
  },

  /**
   * Is a way blocked if an unit of an owner want to move to a given position?
   *
   * @param x
   * @param y
   * @param owner
   * @private
   */
  _wayBlocked: function( x,y, owner, lastTile ){

    // check current position
    var unit = cwt.model.unitByPos(x,y);
    if( unit !== null ){

      if( unit.owner === owner ){

        if( lastTile ){
          // that is a fault
          cwt.log.error("cannot move onto a tile that is occupied by an own unit");
        }
        // else move through it :P
      }
      else if( cwt.model.player(unit.owner).team === cwt.model.player(owner).team ){

        if( lastTile ){

          // that is a fault
          cwt.log.error("cannot move onto a tile that is occupied by an allied unit");
        }
        // else move through it :P
      }
      else{

        // enemy unit
        return true;
      }
    }

    return false;
  }
}