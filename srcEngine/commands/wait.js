controller.unitAction({
  
  key:"wait",
  
  condition: function( data ){
    var mode = data.thereIsUnitRelationShip( data.source, data.target );
    if( mode !== model.relationModes.NONE && mode !== model.relationModes.SAME_OBJECT ) return false;
    
    return true;
  },
  
  invoke: function( data ){
    controller.sharedInvokement("markUnitNonActable",[data.source.unitId]);
  }
  
});