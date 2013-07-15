controller.unitAction({
  
  key:"transferUnit",
  hasSubMenu: true,
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.SAME_OBJECT ) return false;
    
    // LOADED UNITS CANNOT BE TRANSFERED TO OTHER PLAYERS (@TODO: ALLOW IN FUTURE)
    if( model.hasLoadedIds( data.source.unitId ) ) return false; 
    
    return true;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=constants.MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== constants.INACTIVE_ID ){
        data.menu.addEntry(i, true );
      }
    }
  },
  
  invoke: function( data ){
    controller.sharedInvokement("transferUnit",[ data.source.unitId, data.action.selectedSubEntry ]);
  }
  
});