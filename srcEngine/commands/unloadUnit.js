controller.registerCommand({

  key: "unloadUnit",
  unitAction: true,
  multiStepAction: true,

  // -----------------------------------------------------------------------
  prepareMenu: function( data, addEntry ){
    var selectedId = data.getSourceUnitId();
    var loads = model.getLoadedIds( selectedId );
    for( var i=0,e=loads.length; i<e; i++ ){
      addEntry( loads[i] );
    }
  },

  // -----------------------------------------------------------------------
  prepareTargets: function( data, selectionData ){
    var subEntry = data.getSubAction( );
    var tx = data.getTargetX( );
    var ty = data.getTargetY( );

    var load = model.units[ subEntry ];
    var loadS = model.sheets.unitSheets[ load.type ];
    var loadMvS = model.sheets.movetypeSheets[ loadS.moveType ];

    if( tx > 0 ){
      if( model.unitPosMap[tx-1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx-1][ty] ) !== -1  ){
        selectionData.setPositionValue( tx-1,ty,1 );
      }
    }

    if( ty > 0 ){
      if( model.unitPosMap[tx][ty-1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty-1] ) !== -1  ){
        selectionData.setPositionValue( tx,ty-1,1 );
      }
    }

    if( ty < model.mapHeight-1 ){
      if( model.unitPosMap[tx][ty+1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty+1] ) !== -1  ){
        selectionData.setPositionValue( tx,ty+1,1 );
      }
    }

    if( tx < model.mapWidth-1 ){
      if( model.unitPosMap[tx+1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx+1][ty] ) !== -1  ){
        selectionData.setPositionValue( tx+1,ty,1 );
      }
    }
  },

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    if( data.getTargetUnit() !== null ) return false;

    var selectedUnitId = data.getSourceUnitId();
    return (
      model.isTransport( selectedUnitId ) &&
        model.hasLoadedIds( selectedUnitId )
    );
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var loadId      = data.getSubAction();
    var transportId = data.getSourceUnitId();
    var tx          = data.getActionTargetX();
    var ty          = data.getActionTargetY();
    var trsx        = data.getTargetX();
    var trsy        = data.getTargetY();

    // SEND TRANSPORTER INTO WAIT
    controller.invokeCommand( data, "wait" );

    // SEND LOADED UNIT INTO WAIT
    model.unloadUnitFrom( loadId, transportId );

    var moveCode;
         if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
    else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
    else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
    else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;

    var tmpAction = controller.aquireActionDataObject();
    tmpAction.setSourceUnit( model.units[loadId] );
    tmpAction.setMovePath( [ moveCode ] );
    tmpAction.setAction( "wait");
    tmpAction.setSource( trsx, trsy );
    controller.pushActionDataIntoBuffer( tmpAction, true );
  }

});