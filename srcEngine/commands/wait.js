controller.unitAction({
  
  key:"wait",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.MODE_NONE && mode !== model.MODE_SAME_OBJECT ) return false;
    
    return true;
  },
  
  invoke: function( data ){
    model.markUnitNonActable.callAsCommand(data.source.unitId);
  }
  
});
