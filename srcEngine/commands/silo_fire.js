controller.unitAction({
  
  key:"silofire",
  
  prepareSelection: function( data ){
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },
  
  isTargetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },
    
  condition: function( data ){
    var unitRel = data.thereIsUnitRelationShip( data.source, data.target );
    if( unitRel !== model.relationModes.SAME_OBJECT && unitRel !== model.relationModes.NONE ) return false;
    
    if( !data.target.property ) return false;
    
    var propRel = data.thereIsUnitToPropertyRelationShip( data.source, data.target );
    if( propRel !== model.relationModes.NONE ) return false;
    
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