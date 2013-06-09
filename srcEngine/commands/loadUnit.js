controller.unitAction({
  
  key:"loadUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_OWN ) return false;
    
    var tuid = data.target.unitId;
    return model.isTransport( tuid ) && model.canLoad( data.source.unitId, tuid );
  },
  
  invoke: function( data ){
    model.loadUnitInto.callAsCommand( data.source.unitId, data.target.unitId );
  }
 
});