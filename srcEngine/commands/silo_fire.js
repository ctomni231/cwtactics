controller.action_unitAction({
  
  key:"silofire",
	relation:[ "S","T", model.player_RELATION_MODES.SAME_OBJECT, model.player_RELATION_MODES.NONE],
	relationToProp:[ "S","T", model.player_RELATION_MODES.NONE],
  
  prepareSelection: function( data ){
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },
  
  isTargetValid: function( data, x,y ){
    return model.map_isValidPosition(x,y);
  },
    
  condition: function( data ){
    return model.bombs_canBeFiredBy( data.target.propertyId, data.source.unitId );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("bombs_fireSilo",[
      data.target.x, 
      data.target.y, 
      data.targetselection.x, 
      data.targetselection.y,
      data.source.unit.owner
    ]);
  }
});