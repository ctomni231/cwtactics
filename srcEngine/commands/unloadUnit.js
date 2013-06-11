util.scoped(function(){
  
  function checkTile( x,y, movetype, loader ){
    if( model.isValidPosition(x,y) ){
      
      // CAN MOVE TECHNICALLY ?
      if( model.moveCosts( movetype, model.map[x][y] ) === -1 ) return false;
      
      // IF TILE IS IN FOG THEN OCCUPYING UNITS AREN'T IMPORTANT
      if( model.fogData[x][y] === 0 ) return true;
      
      var unit = model.unitPosMap[x][y];
      if( unit !== null && unit !== loader ) return false;
      return true;
    }
  }
  
  controller.unitAction({
    
    key:"unloadUnit",
    multiStepAction: true,
    
    condition: function( data ){
      var mode = data.thereIsUnitRelationShip( data.source, data.target );
      if( mode !== model.MODE_SAME_OBJECT && mode !== model.MODE_NONE ) return false;
      
      
      var uid = data.source.unitId;
      var loader = data.source.unit;
      if( !( model.isTransport( uid ) && model.hasLoadedIds( uid ) ) ) return false;
      
      var x = data.target.x;
      var y = data.target.y;
      for( var i=CWT_MAX_UNITS_PER_PLAYER*model.turnOwner, 
          e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
        
        var unit = model.units[i];
        if( unit.owner !== CWT_INACTIVE_ID && unit.loadedIn === uid ){
          
          var movetp = model.moveTypes[ unit.type.movetype ];
          if( unit.owner !== CWT_INACTIVE_ID && unit.loadedIn === uid ){
            if( checkTile(x-1,y,movetp,loader) || 
               checkTile(x+1,y,movetp,loader) ||
               checkTile(x,y-1,movetp,loader) || 
               checkTile(x,y+1,movetp,loader) ) return true;   
          }
        }
      }
      
      return false;
    },
    
    prepareMenu: function( data ){
      
      var x = data.target.x;
      var y = data.target.y; 
      var uid = data.source.unitId;
      var loader = data.source.unit;
      for( var i=CWT_MAX_UNITS_PER_PLAYER*model.turnOwner, e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
        var unit = model.units[i];
        if( unit.owner !== CWT_INACTIVE_ID && unit.loadedIn === data.source.unitId ){
          
          var unit = model.units[i];
          if( unit.owner !== CWT_INACTIVE_ID && unit.loadedIn === uid ){
            
            var movetp = model.moveTypes[ unit.type.movetype ];
            if( checkTile(x-1,y,movetp,loader) || 
               checkTile(x+1,y,movetp,loader) ||
               checkTile(x,y-1,movetp,loader) || 
               checkTile(x,y+1,movetp,loader) ) data.menu.addEntry( i, true );
          }
        }
      }
    },
    
    targetSelectionType: "B",
    prepareTargets: function( data ){
      var x = data.target.x;
      var y = data.target.y;
      var loader = data.source.unit;
      var movetp = model.moveTypes[model.units[ data.action.selectedSubEntry ].type.movetype];
      
      if( checkTile(x-1,y,movetp,loader) ) data.selection.setValueAt( x-1,y, 1 );
      if( checkTile(x+1,y,movetp,loader) ) data.selection.setValueAt( x+1,y, 1 );
      if( checkTile(x,y-1,movetp,loader) ) data.selection.setValueAt( x,y-1, 1 );
      if( checkTile(x,y+1,movetp,loader) ) data.selection.setValueAt( x,y+1, 1 );
    },
    
    invoke: function( data ){
      var tx = data.target.x;
      var ty = data.target.y;
      
      model.unloadUnitFrom.callAsCommand( 
        data.source.unitId, 
        data.target.x, 
        data.target.y, 
        data.action.selectedSubEntry, 
        data.targetselection.x, 
        data.targetselection.y 
      )
    }
  });
});