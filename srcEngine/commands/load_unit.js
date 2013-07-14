controller.unitAction({
  
  key:"loadUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.OWN ) return false;
    
    var tuid = data.target.unitId;
    return model.isTransport( tuid ) && model.canLoad( data.source.unitId, tuid );
  },
  
  invoke: function( data ){
    controller.sharedInvokement( "loadUnitInto",[ data.source.unitId, data.target.unitId ]);
  }
 
});