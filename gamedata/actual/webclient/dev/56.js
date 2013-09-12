controller.unitAction({
  
  key:"silofire",
	relation:[ "S","T", model.relationModes.SAME_OBJECT, model.relationModes.NONE],
	relationToProp:[ "S","T", model.relationModes.NONE],
  
  prepareSelection: function( data ){
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },
  
  isTargetValid: function( data, x,y ){
    return model.isValidPosition(x,y);
  },
    
  condition: function( data ){
    return model.isSiloFirableBy( data.target.propertyId, data.source.unitId );
  },
  
  invoke: function( data ){
    model.fireSilo.callAsCommand(
      data.target.x, 
      data.target.y, 
      data.targetselection.x, 
      data.targetselection.y,
      data.source.unit.owner
    );
  }
});