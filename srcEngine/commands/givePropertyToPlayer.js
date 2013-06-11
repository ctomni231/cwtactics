controller.propertyAction({
  
  key:"transferProperty",
  hasSubMenu: true,
  
  condition: function( data ){
    var type = data.source.property.type;
    if( type.notTransferable ) return false;
    return true;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ) data.menu.addEntry(i,true);
    }
  },
  
  invoke: function( data ){
    model.transferProperty.callAsCommand( data.source.propertyId, data.action.selectedSubEntry );
  }
});