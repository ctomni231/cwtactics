controller.unitAction({
  
  key:"transferUnit",
  hasSubMenu: true,
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_SAME_OBJECT ) return false;
    
    // LOADED UNITS CANNOT BE TRANSFERED TO OTHER PLAYERS (@TODO: ALLOW IN FUTURE)
    if( model.hasLoadedIds( data.source.unitId ) ) return false; 
    
    return true;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ) data.menu.addEntry(i, true );
    }
  },
  
  invoke: function( data ){
    model.transferUnit.callAsCommand( data.source.unitId, data.action.selectedSubEntry );
  }
  
});