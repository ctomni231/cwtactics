/**
 * Selects unit objects.
 *
 * @private
 * @param pidFits
 * @param tidFits
 */
cwt._createPidTidSelector = function( pidFits, tidFits ){
  var units = cwt._units;

  return function( pid ){
    var result = [];
    var tid = cwt.player(pid).team;
    var cPid = -1;
    var cTid = -1;

    for( var i=0,e=units.length; i<e; i++ ){

      // next player
      if( i % cwt.MAX_UNITS_PER_PLAYER === 0 ){
        cPid++;
        var player = cwt.player(cPid);
        if( player !== null ){
          cTid = player.team;
        }
        else{
          // go to next player
          i += cwt.MAX_UNITS_PER_PLAYER-1;
          continue;
        }
      }

      // check by modificator
      var unit = cwt.unitById(i);
      if( unit !== null &&
        ((cPid === pid) === pidFits ) &&
        ((cTid === tid) === tidFits )
        ){
        result[ result.length ] = unit;
      }
    }

    return result;
  };
}

/**
 * Selects property objects.
 *
 * @private
 * @param pidFits
 * @param tidFits
 */
cwt._createPidTidSelectorProperties = function( pidFits, tidFits ){
  var properties = cwt._properties;

  return function( pid ){
    var result = [];
    var tid = cwt.player(pid).team;
    for( var i=0,e=properties.length; i<e; i++ ){

      // check by modificator
      var prop = cwt.propertyById(i);
      if( prop !== null && prop.owner !== -1 &&
        (( prop.owner === pid) === pidFits ) &&
        (( cwt.player(prop.owner).team === tid) === tidFits )
        ){
        result[ result.length ] = prop;
      }
    }

    return result;
  };
}

cwt.selectOwnUnits = null;
cwt.selectEnemyUnits = null;
cwt.selectAlliedUnits = null;

cwt.selectOwnProperties = null;
cwt.selectEnemyProperties = null;
cwt.selectAlliedProperties = null;

cwt.onInit("selectors",function(){
  cwt.selectOwnUnits = cwt._createPidTidSelector(true,true);
  cwt.selectEnemyUnits = cwt._createPidTidSelector(false,false);
  cwt.selectAlliedUnits = cwt._createPidTidSelector(false,true);

  cwt.selectOwnProperties = cwt._createPidTidSelectorProperties(true,true);
  cwt.selectEnemyProperties = cwt._createPidTidSelectorProperties(false,false);
  cwt.selectAlliedProperties = cwt._createPidTidSelectorProperties(false,true);
});