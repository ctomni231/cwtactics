controller.mapAction({
  
  key:"nextTurn",
  
  condition: function( data ){
    var unit = data.source.unit;
    if( unit !== null && unit.owner === model.turnOwner && model.canAct( data.source.unitId) ) return false;
       
    var property = data.source.property;
    if( property !== null && property.type.builds ) return false;
    
    return true;
  },
  
  invoke: function(){
    model.nextTurn.callAsCommand();
  }
  
});