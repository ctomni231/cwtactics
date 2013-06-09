controller.propertyAction({
  
  key:"transferProperty",
  propertyAction:true,
  hasSubMenu: true,
  
  condition: function( data ){
    if( data.source.property.type.noTransfer ) return false;
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