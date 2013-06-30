controller.unitAction({
  
  key:"supplyUnit",
  
  condition: function( data ){
    if( !data.source.unit.type.supply ) return false;
    
    var pid = data.source.unit.owner;
    var x = data.target.x;
    var y = data.target.y;
    
    // TODO CHECK CAN_SUPPORT IN FUTURE
    return model.relationShipCheckUnitNeighbours( pid, x, y, model.MODE_OWN );
  },
  
  invoke: function( data ){
    model.unitSuppliesNeighbours.callAsCommand( data.source.unitId );    
  }
  
});