controller.propertyAction({
  
  key:"transferProperty",
  hasSubMenu: true,
  
  condition: function( data ){
    return data.source.property.type.notTransferable;
  },
  
  prepareMenu: function( data ){
    for( var i= 0,e=constants.MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== constants.INACTIVE_ID ){
        data.menu.addEntry(i,true);
      }
    }
  },
  
  invoke: function( data ){
    controller.sharedInvokement("transferProperty",[ data.source.propertyId, data.action.selectedSubEntry ]);
  }
});