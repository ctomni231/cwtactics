controller.unitAction({
  
  key:"unhideUnit",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    return data.source.unit.hidden;
  },
  
  invoke: function( data ){
    model.unhideUnit.callAsCommand( data.source.unitId ); 
  }
  
});
