controller.unitAction({
  
  key:"silofire",
  
  isTargetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },
  
  selectionRange: 2,
  
  condition: function( data ){
    var unitRel = data.thereIsUnitRelationShip( data.source, data.target );
    if( unitRel !== model.MODE_SAME_OBJECT && unitRel !== model.MODE_NONE ) return false;
    
    if( !data.target.property ) return false;
    
    var propRel = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
    if( propRel !== model.MODE_NONE ) return false;
    
    var silo = data.target.property.type.rocketsilo;
    if( !silo ) return false;
    if( silo.fireable.indexOf(data.source.unit.type.ID) === -1 ) return false;
    
    return true;
  },
  
  invoke: function( data ){
    var silo = data.target.property.type.rocketsilo;
    model.fireSilo.callAsCommand(
      data.target.propertyId, 
      data.targetselection.x, 
      data.targetselection.y,
      silo.range,
      model.ptToHp(silo.damage),
      data.source.unit.owner
    );
  }
});