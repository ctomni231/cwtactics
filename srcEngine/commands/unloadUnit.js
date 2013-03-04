controller.userAction({

  name: "unloadUnit",

  key: "UNUN",

  unitAction: true,
  multiStepAction: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    if( mem.targetUnit !== null ) return false;

    var selectedUnitId = mem.sourceUnitId;
    return (
      model.isTransport( selectedUnitId ) &&
        model.hasLoadedIds( selectedUnitId )
      );
  },

  prepareMenu: function( mem ){
    var selectedId = mem.sourceUnitId;
    var loads = model.getLoadedIds( selectedId );
    for( var i=0,e=loads.length; i<e; i++ ){
      mem.addEntry( loads[i] );
    }
  },

  targetSelectionType: "B",
  prepareTargets: function( mem ){
    var subEntry = mem.subAction;
    var tx = mem.targetX;
    var ty = mem.targetY;

    var load = model.units[ subEntry ];
    var loadS = model.sheets.unitSheets[ load.type ];
    var loadMvS = model.sheets.movetypeSheets[ loadS.moveType ];
    
    var weather = model.weather.ID;

    if( tx > 0 ){
      if( model.unitPosMap[tx-1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx-1][ty] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx-1,ty,1 );
      }
    }

    if( ty > 0 ){
      if( model.unitPosMap[tx][ty-1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty-1] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx,ty-1,1 );
      }
    }

    if( ty < model.mapHeight-1 ){
      if( model.unitPosMap[tx][ty+1] === null &&
        model.moveCosts( loadMvS, model.map[tx][ty+1] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx,ty+1,1 );
      }
    }

    if( tx < model.mapWidth-1 ){
      if( model.unitPosMap[tx+1][ty] === null &&
        model.moveCosts( loadMvS, model.map[tx+1][ty] ,weather ) !== -1  ){
        mem.setSelectionValueAt( tx+1,ty,1 );
      }
    }
  },

  createDataSet: function( mem ){
    return [
      mem.sourceUnitId,
      mem.targetX,
      mem.targetY,
      mem.subAction,
      mem.selectionX,
      mem.selectionY
    ];
  },

  /**
   * Unloads an unit from an transporter to an neighbour tile´.
   *
   * @param {Number} transportId transporter id
   * @param {Number} trsx x coordinate of the transporter
   * @param {Number} trsy y coordinate of the transporter
   * @param {Number} loadId unit id of the load
   * @param {Number} tx x coordinate of the target
   * @param {Number} ty y coordinate of the target
   * 
   * @methodOf controller.actions
   * @name unloadUnit
   */
  action: function( transportId, trsx, trsy, loadId, tx,ty ){

    // SEND TRANSPORTER INTO WAIT
    controller.actions.wait( transportId );

    // SEND LOADED UNIT INTO WAIT
    model.unloadUnitFrom( loadId, transportId );

    var moveCode;
         if( tx < trsx ) moveCode = model.MOVE_CODE_LEFT;
    else if( tx > trsx ) moveCode = model.MOVE_CODE_RIGHT;
    else if( ty < trsy ) moveCode = model.MOVE_CODE_UP;
    else if( ty > trsy ) moveCode = model.MOVE_CODE_DOWN;
    
    controller.pushAction( [ moveCode ], loadId, trsx, trsy, "MOVE" );
    controller.pushAction( loadId, "WTUN" );
  }

});