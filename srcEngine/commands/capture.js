controller.unitAction({
  
  key:"capture",
  
  condition: function( data ){
    if( data.target.property === null ) return null;
    
    var modeProp = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
    if( modeProp !== model.relationModes.ENEMY && modeProp !== model.relationModes.NONE ) return false;
    
    return data.target.property.type.points > 0 && data.source.unit.type.captures > 0;
  },
  
  invoke: function( data ){
    controller.sharedInvokement("captureProperty",[ data.source.unitId, data.target.propertyId ]);
  }
  
});