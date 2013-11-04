controller.action_unitAction({
  
  key:"unit_hide",
	
	relation: ["S","T",model.player_RELATION_MODES.NONE,model.player_RELATION_MODES.SAME_OBJECT],
  
  condition: function( data ){
    var unit = data.source.unit;
    return unit.type.stealth && !unit.hidden;
  },
          
  invoke: function( data ){
    controller.action_sharedInvoke("unit_hide",[ 
			data.source.unitId 
		]);
  }
  
});