controller.unitAction({
  
  key:"supplyUnit",
  
  condition: function( data ){
    if( !data.source.unit.type.supply ) return false;
    
    var pid = data.source.unit.owner;
    var x = data.target.x;
    var y = data.target.y;
    
    return model.relationShipCheckUnitNeighbours( pid, x, y, model.relationModes.OWN );
  },
  
  invoke: function( data ){
    controller.sharedInvokement( "unitSuppliesNeighbours",[ data.source.unitId ]);
  }
  
});