/**
 * Retusn a list of loaded unit ids by a given transporter id.
 *
 * @param tid
 */
game.getLoadedIds = function( tid ){
  var loaded = [];
  var pid = game.unitById( tid ).owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = game.unitById( i );
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
game.hasLoadedIds = function( tid ){
  var pid = game.unitById( tid ).owner;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*pid,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = game.unitById( i );
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
game.isLoadedBy = function( lid, tid ){
  return game.unitById( lid ).loadedIn === tid;
};

/**
 * Loads the unit with id lid into a tranporter with the id tid.
 *
 * @param lid
 * @param tid
 */
game.loadUnitInto = function( lid, tid ){
  if( !game.canLoad( lid,tid ) ){
    util.logError("transporter unit",tid,"cannot load unit",lid);
  }

  game.unitById( lid ).loadedIn = tid;
};

/**
 * Unloads the unit with id lid from a tranporter with the id tid.
 *
 * @param lid
 * @param tid
 */
game.unloadUnitFrom = function( lid, tid ){
  game.unitById( lid ).loadedIn = -1;
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
game.canLoad = function( lid, tid ){
  var tp = game.unitById(tid);
  var lu = game.unitById(lid);

  // CALCULATE CURRENT LOADED WEIGHT
  var cW = 0;
  for( var i=CWT_MAX_UNITS_PER_PLAYER*tp.owner,
         e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( i !== tid ){
      var unit = game.unitById( i );
      if( unit !== null && unit.loadedIn === tid ){
        cW += game.unitSheet( game.unitById(i).type ).weight;
      }
    }
  }

  // CALCULATE FUTURE WEIGHT
  cW += game.unitSheet( lu.type ).weight;

  var tps = game.unitSheet( tp.type ).transport;
  if( cW > tps.maxWeight ) return false;

  // IS UNIT TYPE LOADABLE
  var unitSh = game.unitSheet( game.unitById(lid).type );
  var tpsL = tps.canLoad;

  // ID
  if( tpsL.indexOf( game.unitById(lid).type ) !== -1 ) return true;

  // TAGS
  var tags = unitSh.tags;
  for( var i=0,e=tags.length; i<e; i++ ){
    if( tpsL.indexOf( tags[i] ) !== -1 ) return true;
  }

  // ALL TYPE
  if( tpsL.indexOf("*") !== -1 ) return true;

  return false;
};

/**
 * Returns true if the unit with id tid is a traensporter, else false.
 *
 * @param tid
 */
game.isTransport = function( tid ){
  return game.unitSheet( game.unitById(tid).type ).transport !== undefined;
};

/**
 * Loads an unit into a transporter unit.
 */
actions.loadUnit = {
  condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
    if( selected === null ) return;
    if( rStU !== game.RELATIONSHIP_SAME_OWNER ) return;

    return (
      game.isTransport( game.extractUnitId(unit) ) &&
        game.canLoad( game.extractUnitId(selected), game.extractUnitId(unit) )
      );
  },

  action: function( x, y, suid, tprid, tuid ){
    game.eraseUnitPosition( suid );
    game.loadUnitInto( suid, tuid );
    game.setUnitPosition( tuid, x,y );
    signal.emit( signal.EVENT_INTO_WAIT, suid );
  }
};

/**
 * Unloads an unit from a tranporter unit.
 */
actions.unloadUnit = {

  targetSelection: true,
  hasSubMenu: true,

  prepareSubMenu: function( menu, selected, tx, ty ){
    var loads = game.getLoadedIds( game.extractUnitId( selected ) );
    for( var i=0,e=loads.length; i<e; i++ ){
      menu.push( loads[i] );
    }
  },

  prepareTargets: function( selected, tx, ty, subEntry ){
    var load = game.unitById( subEntry );
    var loadS = game.unitSheet( load.type );
    var loadMvS = game.movetypeSheet( loadS.moveType );

    if( tx > 0 ){
      if( game.unitByPos( tx-1, ty ) === null &&
        game.moveCosts( loadMvS, game.tileByPos(tx-1,ty) ) !== -1  ){
        controller.setValueOfSelectionPos( tx-1,ty,1 );
      }
    }

    if( ty > 0 ){
      if( game.unitByPos( tx, ty-1 ) === null &&
        game.moveCosts( loadMvS, game.tileByPos(tx,ty-1) ) !== -1  ){
        controller.setValueOfSelectionPos( tx,ty-1,1 );
      }
    }

    if( ty < game.mapHeight()-1 ){
      if( game.unitByPos( tx, ty+1 ) === null &&
        game.moveCosts( loadMvS, game.tileByPos(tx,ty+1) ) !== -1  ){
        controller.setValueOfSelectionPos( tx,ty+1,1 );
      }
    }

    if( tx < game.mapWidth()-1 ){
      if( game.unitByPos( tx+1, ty ) === null &&
        game.moveCosts( loadMvS, game.tileByPos(tx+1,ty) ) !== -1  ){
        controller.setValueOfSelectionPos( tx+1,ty,1 );
      }
    }
  },

  condition: function( x,y,rStP,rStU,selected,property,unit, moved ){
    if( selected === null || !game.isUnit(selected) ) return;
    if( rStU !== game.RELATIONSHIP_NONE ) return;

    return (
      game.isTransport( game.extractUnitId(selected) ) &&
        game.hasLoadedIds( game.extractUnitId(selected) )
      );
  },

  action: function( x, y, sid, prid, tid, ax, ay, subEntry ){
    game.unloadUnitFrom( sid, tid );
    game.setUnitPosition( subEntry, ax, ay );
    signal.emit( signal.EVENT_INTO_WAIT, sid );
    signal.emit( signal.EVENT_INTO_WAIT, subEntry );
  }
};